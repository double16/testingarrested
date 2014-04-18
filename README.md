

BuildConfig.groovy
```groovy
compile ':arrested:1.9'
```

ggts (ctrl alt shift g) or grails command line run: 
```
create-arrested-app

```
or from command line run:
```
grails create-arrested-app
```

This will show something like:
```
| Created file grails-app/domain/arrested/ArrestedToken.groovy
| Created file grails-app/domain/arrested/ArrestedUser.groovy
| Created file grails-app/controllers/arrested/ArrestedController.groovy
ArrestedController.groovy created
| Created file grails-app/controllers/arrested/ArrestedUserController.groovy
| Created file test/integration/arrested/ArrestedUserControllerIntegrationTest.groovy
| Created file test/unit/arrested/ArrestedUserControllerUnitTest.groovy
ArrestedUserController.groovy created and Unit & Integration Tests
| Created file web-app/js//userCtrl.js
| Created file web-app/Views/auth/login.html
userController.js and login.html created
| Created file grails-app/controllers/arrested/AuthController.groovy
| Created file test/integration/arrested/AuthControllerIntegrationTests.groovy
| Created file test/unit/arrested/AuthControllerUnitTest.groovy
| Created file grails-app/conf/arrested/SecurityFilters.groovy
UrlMappings.groovy updated
ApplicationResources.groovy updated
| Created file web-app/js//services.js
index.js created
main.gsp, index.gsp, arrested.css, _navbar.gsp updated
```

Now check out web-app js and web-app/Views 

Arrested plugin will produce a working project something very similar to what grails provides but with gsps as html inside:
``` 
web-app/Views/{domainClass}
```

Each time you create a new domainClass it updates web-app/index.js with the new pages, so in short angularJS 
is now controlling your site and these are the bits if you so wish to manually update.


Each time you create a domainClass and create-arrested-controller domainClass a js file is placed in this folder.
 




ggts (ctrl alt shift g) or grails command line run: 
```
create-domain-class Books


create-domain-class Authors

```

domainClass Books.groovy:
```groovy
package grails.arrested.tester

class Books {
	
	String name
	Authors author
    static constraints = {
    }
	
	String toString() {
		"${name}"
	}
}

class Numbers {
	Integer firstNumber
    static constraints = {
		firstNumber min:1, max:99
    }
}

```

domainClass Authors.groovy:
```groovy
package grails.arrested.tester

class Authors {
	String firstName
	String surName
	static hasMany = [ books: Books]
    static constraints = {
    }
	
	
	String toString() {
		"${firstName}:${surName}"
	}
}
```

Create controllers:
```
create-arrested-controller Books
create-arrested-controller Authors
```

Typical output from creating controllers :
```
|Created file grails-app/controllers/testingarrested/NumbersController.groovy
..
|Created file test/integration/testingarrested/NumbersControllerIntegrationTest.groovy
..
|Created file test/unit/testingarrested/NumbersControllerUnitTest.groovy
```


Create views:
```
create-arrested-view Books
create-arrested-view Authors
```

Typical output from view creation:
```
.........................................
|Created file web-app/Views/numbers/list.html
.
|Created file web-app/Views/numbers/edit.html
..
|Created file web-app/js//NumbersCtrl.js
index.js created
ApplicationResources.groovy updated
```

This has now created content in web-app folder, inside two folders js and Views
This now makes a complete site like you would get from a default grails site but now controlled from within these folders.

If you now open edit.html for numbers you will see something like:
```gsp
<div class="fieldcontain">
            <label for="firstNumber">
                firstNumber
            </label>
            <input name="firstNumber" type="number" min="1" max="99" data-ng-model='numbers.firstNumber'  required=""/>
        </div>
```        


BootStrap:
```groovy
import org.apache.shiro.crypto.hash.Sha256Hash

import arrested.ArrestedToken
import arrested.ArrestedUser

class BootStrap {

   def init = { servletContext ->
	ArrestedUser user,user1
		ArrestedToken token,token1
		
		user = new ArrestedUser(
			username: "me@domain.com",
			passwordHash: new Sha256Hash("password").toHex(),
			dateCreated: new Date()
		).save()
		
		 //Create tokens for users
		token = new ArrestedToken(
			token: 'token',
			valid: true,
			owner: user.id
		).save(flush: true)
		user.setToken(token.id)
		user.save()
		
    
    }
    def destroy = {
    }
}
```

#### Done, Welcome to your grails application now taken over by AngularJS which now interacts with your database using REST 

If you are new to both technologies this will at first appear to be a mind bending experience but I am hoping to get you all the more familiar with how this is all working


## Looking underneath the hood:

In short the above commands has updated some of the core methods your default grails application works and has pointed everything back at angularJS framework to run/control.

Places to look for updates: Your overall application 
```
views/index.gsp is now a template similar to your layouts/main.gsp page as per a default grails application
views/layouts/_navbar.gsp - this now loads your navigation bar for your site 
conf/ApplicationResource.groovy has been updated and is updated each time a new controller is created using create-arrested-controller.
conf/arrested/SecurityFilters.groovy is created as per default create-arrested-app
```

So by default the UrlMapping point to index, in index.gsp:

```
data-ng-view
```

This triggers AngularJS to take over, the actions of index.js are triggered which redirect to /login. This would happen to both authenticate and not authenticated users.
If however the user has extra additional input on the url line to call a specific controller/action then remember the SecurityFilters.groovy, this is also filtering the user, so if not authenticated they are redirected back to login page.
  

Places to look for updates: each time you create new domainclasses controllers Views:

Controllers:
```
controllers/arrested/ contains default arrested controllers to control main site actions user and authentication
controllers/{yourapp}/controllerName.groovy - contains your create-arrested-controller {controlleName} file which is written to work with this framework

```

Views:
```
All views are now created in:
 
web-app/Views/{yourapp}/(edit.html|list.html) 
web-app/js/{ControllerNameCtrl.js|index.js|services.js|userCtrl.js} 
```

So by default when you run create-arrested-view Books this creates a web-app/Views/books/(edit.html|list.html), and updates index.js as well as create BooksCtrl.js

Lets dive deeper into what is going on above.


####js/index.js
So this adds the actions for the default CRUD generation to index.js - if you want to create your own custom actions this is where you need to update to define what/where etc.

```js
           when('/books/create', {templateUrl: 'Views/books/edit.html', controller: 'BooksCtrl'}).
            when('/books/edit', {templateUrl: 'Views/books/edit.html', controller: 'BooksCtrl'}).
            when('/books/list', {templateUrl: 'Views/books/list.html', controller: 'BooksCtrl'}).
            when('/books', {templateUrl: 'Views/books/list.html', controller: 'BooksCtrl'}).
```


####js/services.js
Nothing to do here - this is your REST AngularJS controller telling it what to do for each type of rest call 
```js
'use strict';
angular.module('services',['ngResource']).
    factory('DAO', function($resource){
        return $resource('/:appName/:controller/:action',{
            format:'json', callback:'JSON_CALLBACK'},{
            'get':   {method:'GET', params:{appName:'@appName', controller:'@controller', action:'@action', token:'@token', id:'@id'}, isArray:false, timeout:20000},
            'query': {method:'GET', params:{appName:'@appName', controller:'@controller', action:'@action', token:'@token'}, isArray: true, timeout:20000},
            'save':  {method:'POST', params:{appName:'@appName', controller:'@controller', action:'@action', token:'@token', instance:'@instance', username:'@username', passwordHash:'@passwordHash'}, isArray:false, timeout:20000},
            'update':{method:'PUT', params:{appName:'@appName', controller:'@controller', action:'@action', token:'@token', instance:'@instance'}, isArray:false, timeout:20000},
            'delete':{method:'DELETE', params:{appName:'@appName', controller:'@controller', action:'@action', token:'@token', id:'@id'}, isArray:false, timeout:20000}
        });
    });            
```

```js
return $resource('/:appName/:controller/:action',{
```
You will notice above defined in the main call below, changed since 1.5 - pre 1.5
It passes host information - this may be useful if you wanted to return to this model if you wanted to point the actual rest service to another host

```js
'use strict';
angular.module('services',['ngResource']).
    factory('DAO', function($resource){
        return $resource('http://:serverHost/:appName/:controller/:action',{
            format:'json', callback:'JSON_CALLBACK'},{
            'get':   {method:'GET', params:{serverHost:'@serverHost', appName:'@appName', controller:'@controller', action:'@action', token:'@token', id:'@id'}, isArray:false, timeout:20000},
            'query': {method:'GET', params:{serverHost:'@serverHost', appName:'@appName', controller:'@controller', action:'@action', token:'@token'}, isArray: true, timeout:20000},
            'save':  {method:'POST', params:{serverHost:'@serverHost', appName:'@appName', controller:'@controller', action:'@action', token:'@token', instance:'@instance', username:'@username', passwordHash:'@passwordHash'}, isArray:false, timeout:20000},
            'update':{method:'PUT', params:{serverHost:'@serverHost', appName:'@appName', controller:'@controller', action:'@action', token:'@token', instance:'@instance'}, isArray:false, timeout:20000},
            'delete':{method:'DELETE', params:{serverHost:'@serverHost', appName:'@appName', controller:'@controller', action:'@action', token:'@token', id:'@id'}, isArray:false, timeout:20000}
        });
    });

```



####js/UserCtrl/BooksCtrl.js
These files require no updating, userCtrl controls the calls from the html for authentication (views/auth/) and the booksctrl is the controller for edit/list.html in Views/books/(edit|list)


#### html pages - understanding angularJS html5 adaptation


#### edit.html
 
Typical edit.html in /web-app/Views/{domainClass}/edit.html (since 1.9)

```html
<div data-ng-controller="AuthorsCtrl">
    <h1>Authors Edit</h1>
    <div data-ng-show="errors.showErrors" class="red">
        <p data-ng-show="errors.showServerError">"Can not connect to the server, try later"</p>
    </div>
 <form name="authorsForm"  novalidate>
        <p></p>
        <a class="btn btn-primary btn-primary" onclick="window.location.href = '#/authors/list'"><span class="glyphicon glyphicon-align-justify"></span>  List</a>
        <a class="btn btn-primary btn-success" data-ng-hide="authors.id"  ng-disabled="authorsForm.$invalid" ng-enabled="!authorsForm.$invalid" data-ng-click="manualSaveAuthors()"><span class="glyphicon glyphicon-floppy-disk"></span> Save</a>
        <a class="btn btn-primary btn-success" data-ng-show="authors.id"  ng-disabled="authorsForm.$invalid" ng-enabled="!authorsForm.$invalid" data-ng-click="manualSaveAuthors()"><span class="glyphicon glyphicon-floppy-disk"></span> Update</a>
        <a class="btn btn-primary btn-danger" data-ng-show="authors.id"  data-ng-click="confirmDeleteAuthors()"><span class="glyphicon glyphicon-trash"></span> Delete</a>
        <p></p>
    
        <div class="fieldcontain">
            <label for="emailAddress">
                emailAddress
            </label>
            <input type="email" name="emailAddress" required="" data-ng-model='authors.emailAddress' />
		<p ng-show="authorsForm.emailAddress.$error.required" class="help-block">required.</p>
		<p ng-show="!authorsForm.emailAddress.$pristine && authorsForm.emailAddress.$invalid" class="help-block">invalid emailAddress</p>
        </div>
        
        <div class="fieldcontain">
            <label for="firstName">
                firstName
            </label>
            <input type="text" name="firstName" required="" data-ng-model='authors.firstName' />
		<p ng-show="authorsForm.firstName.$error.required" class="help-block">required.</p>
		<p ng-show="!authorsForm.firstName.$pristine && authorsForm.firstName.$invalid" class="help-block">invalid firstName</p>
        </div>
        
        <div class="fieldcontain">
            <label for="surName">
                surName
            </label>
            <input type="text" name="surName" required="" data-ng-model='authors.surName' />
		<p ng-show="authorsForm.surName.$error.required" class="help-block">required.</p>
		<p ng-show="!authorsForm.surName.$pristine && authorsForm.surName.$invalid" class="help-block">invalid surName</p>
        </div>
        
    </form>
 </div>
```

###Lets try to explain what is going on above

```html
data-ng-controller="AuthorsCtrl"
```
This tells the html page to refer to AuthorsCtrl.js within web-app/js folder for all the things it needs to process

```html
data-ng-show="errors.showErrors"
data-ng-show="errors.showServerError"
```
Are set by your AuthorsCtrl.js when the actions on this page fail


```html
<a class="btn btn-primary btn-primary" onclick="window.location.href = '#/authors/list'"><span class="glyphicon glyphicon-align-justify"></span>  List</a>
<a class="btn btn-primary btn-success" data-ng-hide="authors.id"  ng-disabled="authorsForm.$invalid" ng-enabled="!authorsForm.$invalid" data-ng-click="manualSaveAuthors()"><span class="glyphicon glyphicon-floppy-disk"></span> Save</a>
<a class="btn btn-primary btn-success" data-ng-show="authors.id"  ng-disabled="authorsForm.$invalid" ng-enabled="!authorsForm.$invalid" data-ng-click="manualSaveAuthors()"><span class="glyphicon glyphicon-floppy-disk"></span> Update</a>
<a class="btn btn-primary btn-danger" data-ng-show="authors.id"  data-ng-click="confirmDeleteAuthors()"><span class="glyphicon glyphicon-trash"></span> Delete</a>
```   

1.  shows list (if there is items to list)


2.  data-ng-hide="authors.id"  ng-disabled="authorsForm.$invalid" ng-enabled="!authorsForm.$invalid" data-ng-click="manualSaveAuthors()"

hide the id, i.e. new record disable option if form is invalid, enable it if valid, on click carry out manualSaveAuthors within controller, this since id is disabled calls save function



3. data-ng-show="authors.id"  ng-disabled="authorsForm.$invalid" ng-enabled="!authorsForm.$invalid" data-ng-click="manualSaveAuthors()"

if there is id, i.e. update record disable option if form is invalid, enable it if valid, on click carry out manualSaveAuthors within controller, this since id is enabled calls update function



4. data-ng-show="authors.id"  data-ng-click="confirmDeleteAuthors()"

This calls delete confirmDeleteAuthors within controller



```html
<input type="email" name="emailAddress" required="" data-ng-model='authors.emailAddress' />
<p ng-show="authorsForm.emailAddress.$error.required" class="help-block">required.</p>
<p ng-show="!authorsForm.emailAddress.$pristine && authorsForm.emailAddress.$invalid" class="help-block">invalid emailAddress</p>
```
So load up input type email required model is authors.emailAddress, the following lines are pre post validation, if required show required
then pristine means if empty so if not empty and is invalid in the case of email has to be a valid email address show invalid Email address.



Lets look at some number examples:

```html
<p ng-show="!numbersForm.firstNumber.$pristine && numbersForm.firstNumber.$invalid" class="help-block">invalid firstNumber min: 4 max: 10</p>
<p ng-show="numbersForm.firstNumber.$error.number" class="help-block">firstNumber is not valid.</p>
```

The invalid type also loads up what valid min max ranges are and ensures the user has put in a number i.e abc etc will cause is not valid message to popup


Lets look at Strings minSize/maxSize:
```html
<p ng-show="!booksForm.name.$pristine && booksForm.name.$invalid" class="help-block">invalid name min: 5  , max: 20</p>
		<p ng-show="booksForm.name.$error.minlength" class="help-block">name is too short.</p>
		<p ng-show="booksForm.name.$error.maxlength" class="help-block">name is too long.</p>
```
Again if not empty is is valid input - also matches minimum length as well as not above the set maxSize otherwise show nag the user with above users as they type :)

		
		   

		



### typical list.html:
```html
<div data-ng-controller="NumbersCtrl" data-ng-init="getAllNumbers()">
    <h1>Numbers List</h1>
    <div data-ng-show="errors.showErrors" class="red">
        <p data-ng-show="errors.showServerError">"Can not connect to the server, try later"</p>
    </div>
       	<a class="btn btn-primary btn-primary" data-ng-click="newNumbers()"><span class="glyphicon glyphicon-plus"></span> New numbers</a>
      <table class="table table-bordered table-striped">
      <thead>
        <tr>
         <th data-sortable="firstNumber">First Number</th>
       </tr>
       </thead>
       <tbody>
        <tr data-ng-repeat="instance in numberss" data-ng-click="editNumbers(instance)">
         <td>{{instance.firstNumber}}</td>
        </tr>
      </tbody>
 	</table>
 </div>
 ```
 
Understanding list.html                 
                
```html
data-ng-controller="NumbersCtrl" data-ng-init="getAllNumbers()"
```
The page calls numbersCtrl in the js folder and initialises getAllNumbers as the page loads up

```
errors.showErrors 
errors.showServerError
```
Set by the controller when something has gone wrong

```
data-ng-click="newNumbers()"
```
When this hyperlink is clicked it runs the newNumbers function within NumbersCtrl,:
```js
 $rootScope.newNumbers = function () {
    $rootScope.numbers = {};
    window.location.href = "#/numbers/create"
}
```


```html
<th data-sortable="firstNumber">First Number</th>
```
A sortable field called firstNumber


```html
<tr data-ng-repeat="instance in numberss" data-ng-click="editNumbers(instance)">
```
angularJs tag: ng-repeat  : This loops through an sql statement of
``` 
 instance in numberss
 ```
 It also provides an onclick which runs editNumbers(instance) on each table row, so clicking it will automatically end the user in edit mode.
 


```html
<td>{{instance.firstNumber}}</td>
```
How angularJs displays values within a loop {{value}}


### Conclusion
Hopefully by now you will feel more comfortable with this plugin, enough so to be able to tweak your own default CRUD arrested application to do more than what it provides out of the package.
There is probably a lot I have missed.

There are some information out there on AngularJS [AngularJS 60 minutes on youtube](https://www.youtube.com/watch?v=i9MHigUZKEM) - there is also this pdf to download read.
[Scotch.io angularJs](http://scotch.io/tag/angular-js)
The other note is really in regards to the actual web-app folder, since as it is currently you should be able to even move this component out of this application and run in other applications etc.

