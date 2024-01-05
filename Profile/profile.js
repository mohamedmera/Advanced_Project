

document.getElementById('checkboxforpasswordforLogin').addEventListener('change',() => {
    var passwardInput = document.getElementById('password-inputforLogin');
    if(document.getElementById('checkboxforpasswordforLogin').checked){
        passwardInput.type = 'text';
    }else {
        passwardInput.type = 'password';
    }
})

document.getElementById('checkboxforpasswordReg').addEventListener('change',() => {
    var passwardInput = document.getElementById('password-inputforReg');
    if(document.getElementById('checkboxforpasswordReg').checked){
        passwardInput.type = 'text';
    }else {
        passwardInput.type = 'password';
    }
})

const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get('postId')

const baseUrl = 'https://tarmeezacademy.com/api/v1';

function getCurrentUser(){
    let user = null;
    const storgeUser = localStorage.getItem('username')

    if(storgeUser != null){
        user = JSON.parse(storgeUser)
    }
    return user
}


function loginBtnClecked(){
const username = document.getElementById('username-inputforLogin').value
const password = document.getElementById('password-inputforLogin').value

    const prams = {
        username: username,
        password: password
    }

    Loader()

    axios.post(baseUrl + '/login',prams)
    .then(response => {

        const modal = document.getElementById('modalLogin')
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()


        localStorage.setItem('token',response.data.token);
        localStorage.setItem('username',JSON.stringify(response.data.user));
        document.getElementById('usernameTaken').style.display = 'none'
        document.getElementById('fakePassword').style.display = 'none'
        document.getElementById('username-inputforLogin').value = '';
        document.getElementById('password-inputforLogin').value = '';
        setupUI()
        getPost()
    }).catch(() => {
        document.getElementById('fakePassword').style.display = 'flex'
        document.getElementById('usernameTaken').style.display = 'none'

    }).finally( () => Loader(false))

}
setupUI()
function regBtnClecked(){
    const username = document.getElementById('username-inputforReg').value
    const password = document.getElementById('password-inputforReg').value
    const image = document.getElementById('image-inputforReg').files[0]
    const name = document.getElementById('name-inputforReg').value

    let formData = new FormData()
    formData.append('image',image)
    formData.append('username',username)
    formData.append('password',password) 
    formData.append('name',name) 

    Loader()


    axios.post(baseUrl + '/register',formData ,{
        headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => {
        localStorage.setItem('token',response.data.token);
        localStorage.setItem('username',JSON.stringify(response.data.user));

        const modal = document.getElementById('modalReg')
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()

        document.getElementById('usernameTaken').style.display = 'none'
        document.getElementById('fakePassword').style.display = 'none'
        document.getElementById('username-inputforReg').value = '';
        document.getElementById('password-inputforReg').value = '';
        document.getElementById('name-inputforReg').value = '';
        loginBtnClecked()
        
    }).catch(() => {

        document.getElementById('usernameTaken').style.display = 'flex'
        document.getElementById('fakePassword').style.display = 'none'


    }).finally( () => Loader(false))

}


function logOUt(){
    localStorage.removeItem('token')
    localStorage.removeItem('username')

    document.getElementById('logoutdiv').style.display = 'none'
    document.getElementById('btnLoginNav').style.display = 'flex'
    document.getElementById('btnRegNav').style.display = 'flex'

    getPost()

}
function setupUI(){
    const user = getCurrentUser()
    
    const token = localStorage.getItem('token')
    if(token == null){
        // document.getElementById('btnaddPost').style.display = 'none'
        document.getElementById('logoutdiv').style.display = 'none'
        document.getElementById('btnLoginNav').style.display = 'flex'
        document.getElementById('btnRegNav').style.display = 'flex'
    }else{
        // document.getElementById('btnaddPost').style.display = 'flex'
        document.getElementById('logoutdiv').style.display = 'flex'
        document.getElementById('btnLoginNav').style.display = 'none'
        document.getElementById('btnRegNav').style.display = 'none'

        document.getElementById('b').innerHTML = user.username;
        document.getElementById('imgHeader').src = user.profile_image;

    }

}
getUserProfile()

function getUserProfile(){
    
    Loader()

    axios.get(baseUrl + '/users/' + id)
    .then(response => {

        let user = response.data.data;


        document.getElementById('header-image').src = user.profile_image;
        
        document.getElementById('name').innerHTML = user.name;
        document.getElementById('email').innerHTML = user.email;
        document.getElementById('username').innerHTML = user.username;

        document.getElementById('name-author').innerHTML = user.name + ' Posts';

        document.getElementById('Num-Posts').innerHTML = user.posts_count;
        document.getElementById('Num-comments').innerHTML = user.comments_count;
        getPost()

    }).finally( () => Loader(false))

}


function getPost(){

    Loader()

    axios.get(baseUrl + '/users/' + id +'/posts')

    .then(response => {

    

        let posts = response.data.data

        document.getElementById('colectionCards').innerHTML = '';

        
        for(post of posts){

            let postTitle = ""

            let user = getCurrentUser()
            let isMypost = user !=  null && post.author.id == user.id

            let btnconEdit = ``
            let btnconDelete = ``

            if(isMypost){
                btnconEdit = `<button class="btn btn-secondary" onclick="EditPostBtnClecked('${encodeURIComponent(JSON.stringify(post))}')" style="float: right;" id="editbtn"> edit</button>`
                btnconDelete = `<button class="btn btn-danger" onclick="DeletePostBtnClecked('${encodeURIComponent(JSON.stringify(post))}')" style="float: right; margin-left: 10px;" id="deletebtn"> Delete</button>`
            }

            if(post.title != null){
                postTitle = post.title
            }
            const author = post.author;
            let content = `
                <div class="card rounded shadoe">
                    <div class="card-header">
                        <img src="${author.profile_image}" alt="404" class="rounded-circle" style="width: 50px; height: 50px;">  
                        <b class="ml-2">${author.username}</b>
                        
                        ${btnconDelete}
                        
                        ${btnconEdit}


                        <h5 style="color: rgb(111, 111, 111);" class="mt-2">${post.created_at}</h5>
                    </div>
                    <div class="card-body">
                        <img src="${post.image}" alt="404" class="w-100">
                        <h5 class="card-title">${postTitle}</h5>
                        <p class="card-text">
                            ${post.body}
                        </p>
                        <button id="btnLike" class="btn btn-outline-primary" onclick="Like()"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hand-thumbs-up" viewBox="0 0 16 16">
                        <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2 2 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a10 10 0 0 0-.443.05 9.4 9.4 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a9 9 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.2 2.2 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.9.9 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"/>
                        </svg> <span>Like</span>
                     </button>
                        <hr>
                        <div onclick="postClicked(${post.id})" class="inclick">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                            <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
                            </svg>
                            <span>
                                (${post.comments_count})comment
                                <span id="postTags">
                                    
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            `
            document.getElementById('colectionCards').innerHTML += content;

        }
    }).finally( () => Loader(false))
}

function postClicked(postId) {
    location = `postDitailes.html?postId=${postId}`
}

function DeletePostBtnClecked(postOb){
    
    let post = JSON.parse(decodeURIComponent(postOb))

    
    document.getElementById('input-delete').value = post.id

    let postModal = new bootstrap.Modal(document.getElementById('modalDelPost'))
    postModal.show()
}
function confirmDelbtnClk(){
    
    const postId = document.getElementById('input-delete').value

    Loader()

    axios.delete(baseUrl + `/posts/${postId}`, {
        headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => {

        getPost()

    }).finally( () => Loader(false))
}


function AddPostBtnClecked(){


    let postId = document.getElementById('postId-input').value
    let isCreate = postId == null || postId == ''

    
    let text =  document.getElementById('text-inputAddPost').value
    let body =  document.getElementById('textarea-inputAddPost').value
    let image = document.getElementById('image-inputAddPost').files[0]
    
    let formData = new FormData()
    formData.append('image',image)
    formData.append('title',text)
    formData.append('body',body) 
    

    if(isCreate == false){

        formData.append('_method', 'put')

        let url = baseUrl + `/posts/${postId}`

        Loader()

        axios.post(url,formData, {
            headers: {
                authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            getPost()
            document.getElementById('text-inputAddPost').value = '';
            document.getElementById('textarea-inputAddPost').value = '';
        
        }).finally( () => Loader(false))
    }
}   




function EditPostBtnClecked(postOb){
    
    let post = JSON.parse(decodeURIComponent(postOb))

    document.getElementById('text-inputAddPost').value = post.title
    document.getElementById('textarea-inputAddPost').value = post.body
    document.getElementById('postId-input').value = post.id
    document.getElementById('image-inputAddPost').files[0] = post.image
    
    
    document.getElementById('ModalLabelforAddPost').innerHTML = 'Edit Post: '
    document.getElementById('btnAdd').innerHTML = 'update'
    let postModal = new bootstrap.Modal(document.getElementById('modalAddPost'))
    postModal.show()
}

function Loader(show = true){
    if(show){
        document.getElementById('loader').style.display = 'flex'
    }else{
        document.getElementById('loader').style.display = 'none'
    }
}

function Like(){

    document.getElementById('btnLike').classList = 'btn btn-primary'

}