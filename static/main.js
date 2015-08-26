function AppComponent() {}
AppComponent.annotations = [
  new angular.ComponentAnnotation({
    selector: 'my-app'
  }),
  new angular.ViewAnnotation({
    templateUrl: "static/sometemplate.html"
  })
];
document.addEventListener('DOMContentLoaded', function() {
  angular.bootstrap(AppComponent);
});
