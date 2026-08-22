const { Router } = require('express')
const courseRouter = Router()

//purchase router
courseRouter.post('/purchase', function(req,res) {

})

//preview router
courseRouter.get('/preview', function(req,res) {
    
})

module.exports = {
    courseRouter: courseRouter
}