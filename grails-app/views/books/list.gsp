
<div data-ng-controller="BooksCtrl" data-ng-init="getAllBooks()">
    <h1>Books List</h1>
    <div data-ng-show="errors.showErrors" class="red">
        <p data-ng-show="errors.showServerError">"Can not connect to the server, try later"</p>
    </div>
    <div>
        <div>
            <p></p>
            <a class="btn btn-primary btn-primary" data-ng-click="newBooks()"><span class="glyphicon glyphicon-plus"></span> New books</a>
            <p></p>
        </div>
        <div>
            <div>
                <div>
                    

                    <table class="table table-bordered table-striped">
                        <thead>
                        <tr>
                            
                            <th>Author</th>
                            
                            <th data-sortable="content">Content</th>
                            
                            <th data-sortable="displayOnMenu">Display On Menu</th>
                            
                            <th data-sortable="name">Name</th>
                            
                            <th data-sortable="orderby">Orderby</th>
                            
                            <th data-sortable="pricerange">Pricerange</th>
                            
                        </tr>
                        </thead>
                        <tbody>
                        <tr data-ng-repeat="instance in bookss" data-ng-click="editBooks(instance)">
                            
                            <td>{{instance.author}}</td>
                            
                            <td>{{instance.content}}</td>
                            
                            <td>{{instance.displayOnMenu}}</td>
                            
                            <td>{{instance.name}}</td>
                            
                            <td>{{instance.orderby}}</td>
                            
                            <td>{{instance.pricerange}}</td>
                            
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>