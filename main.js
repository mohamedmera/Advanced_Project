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



let currentPage = 1
let lastPage = 1;

// window.addEventListener("scroll", () => {

//     const endOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 1;


//     if (endOfPage  && currentPage < lastPage) {
//         currentPage = currentPage + 1
//         getPost(false,currentPage)
//     }
//   }
//   );

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
        getAlert("Login successful", 'success')
    }).catch(error => {

        document.getElementById('fakePassword').style.display = 'flex'
        document.getElementById('usernameTaken').style.display = 'none'

        getAlert(error.response.data.message, 'danger')

    }).finally( () => Loader(false))

}

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
        getAlert("Register successful", 'success')
        
    }).catch(error => {

        document.getElementById('usernameTaken').style.display = 'flex'
        document.getElementById('fakePassword').style.display = 'none'

        getAlert(error.response.data.massage, 'danger')


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
    

    if(isCreate){

        Loader()

        axios.post(baseUrl + '/posts',formData, {
            headers: {
                authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {

            getPost()
            document.getElementById('text-inputAddPost').value = '';
            document.getElementById('textarea-inputAddPost').value = '';
            getAlert("Create Post successful", 'success')

        
        }).catch(error => {

            getAlert(error.response.data.massage, 'danger')

        }).finally( () => Loader(false))

    }else{
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
            getAlert("Edit Post successful", 'success')
        
        }).catch(error => {

            getAlert(error.response.data.massage, 'danger')

        }).finally( () => Loader(false))

    }

}   



function postClicked(postId) {
    location = `../post Ditailes/postDitailes.html?postId=${postId}`
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

function addbtnClecked(){

    document.getElementById('text-inputAddPost').value = ''
    document.getElementById('textarea-inputAddPost').value = ''
    document.getElementById('postId-input').value = ''
    document.getElementById('image-inputAddPost').files[0] = ''
    
    
    document.getElementById('ModalLabelforAddPost').innerHTML = 'Add Post: '
    document.getElementById('btnAdd').innerHTML = 'Create'
    
    let postModal = new bootstrap.Modal(document.getElementById('modalAddPost'))
    postModal.show()
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
        getAlert('the Post has Deleted', 'success')

    }).catch(error => {
        
        getAlert(error.response.data.massage, 'danger')

    }).finally(() => Loader(false))

}
function getProfile(postId){
    location = `../Profile/profile.html?postId=${postId}`
}
function profileClk(){

    const user = getCurrentUser()
    
    const userId = user.id

    location = `../Profile/profile.html?postId=${userId}`

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