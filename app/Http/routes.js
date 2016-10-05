'use strict'

/*
|--------------------------------------------------------------------------
| Router
|--------------------------------------------------------------------------
|
| AdonisJs Router helps you in defining urls and their actions. It supports
| all major HTTP conventions to keep your routes file descriptive and
| clean.
|
| @example
| Route.get('/user', 'UserController.index')
| Route.post('/user', 'UserController.store')
| Route.resource('user', 'UserController')
*/

const Route = use('Route')

Route.on('/').render('welcome')

Route.resources('projects', 'ProjectController')

Route.get('projects/:project_id/tasks', 'TaskController.index')
Route.get('projects/:project_id/tasks/create', 'TaskController.create')
Route.get('projects/:project_id/tasks/:id', 'TaskController.show')
Route.get('projects/:project_id/tasks/:id/edit', 'TaskController.edit')
Route.post('projects/:project_id/tasks', 'TaskController.store')
Route.put('projects/:project_id/tasks/:id', 'TaskController.update')
Route.delete('projects/:project_id/tasks/:id', 'TaskController.destroy')

// Route.get('projects/:project_id/tasks/:task_id', 'FileItemController.index')
// Route.get('projects/:project_id/tasks/create', 'TaskController.create')
// Route.get('projects/:project_id/tasks/:id', 'TaskController.show')
// Route.get('projects/:project_id/tasks/:id/edit', 'TaskController.edit')
// Route.post('projects/:project_id/tasks', 'TaskController.store')
// Route.put('projects/:project_id/tasks/:id', 'TaskController.update')
// Route.delete('projects/:project_id/tasks/:id', 'TaskController.destroy')
