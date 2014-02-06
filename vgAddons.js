
/*

vgModal: <vg-modal>...</vg-modal>
  - Modal directive
  - Available attributes:
    ~ bgColor, sets opaque background color, default black
    ~ vgOpacity, sets opacity of background, default 0.7
    ~ vgWidth, sets modal width, default 40%
    ~ vgHeight, sets modal height, default 40%
    ~ 

vgPersist: vg-persist
  - Save all in use fields of a form in local storage
  - Form must have name attribute defined
  - add ignore tag to force non persistence (passwords already ignored)

enterNext: vg-next
  - Use in inputs to defer default submit
  - When enter is pressed, focus is moved to next input

*/

angular.module('vgAddons', [])

  .directive('vgModal', function() {
    return {
      restrict: 'E',
      template: "<div ng-show='vgModalShow' ng-style='bgstyling()'></div>" +
                "<div ng-show='vgModalShow' ng-style='fgstyling()' ng-transclude></div>",
      transclude: true,
      scope: false,
      link: function (scope, elem, attrs) {
          var elem_ = elem[0].getElementsByTagName('div')[1].firstChild;
          var width = window.innerWidth, height = window.innerHeight;
          var vgWidth = attrs.vgWidth || '40%';
          var vgHeight = attrs.vgHeight || '40%';
              
          elem.bind('click', function(e) {
              if (scope.ignoreClick) return;

              var pos = elem_.getBoundingClientRect(),
                  clickLeft = e.clientX,
                  clickTop = e.clientY;

              if (clickLeft < pos.left || clickLeft > pos.right ||
                  clickTop < pos.top || clickTop > pos.bottom) 
              {
                  scope.vgModalShow = false;
                  scope.$apply();
              }
          });

          scope.bgstyling = function() {
              return {
                  'position': 'fixed',
                  'top': '0',
                  'left': '0',
                  'bottom': '0',
                  'right': '0',
                  'backgroundColor': attrs.bgColor || '#000',
                  'opacity': attrs.opacity || '0.7'
              }
          }

          scope.fgstyling = function() {
              return {
                  'position': 'fixed',
                  'width': attrs.vgWidth || '40%',
                  'height': attrs.vgHeight || '40%',
                  'left': (100 - parseInt(vgWidth)) / 2 + '%',
                  'top': (100 - parseInt(vgHeight)) / 2 + '%'
              }
          }
      }
    }
  })
  .directive('vgPersist', function() {
    function isPersisted(input) {
        return input.hasAttribute('ng-model') &&
               input.type !== 'password' &&
               !input.hasAttribute('ignore') ?
               true : false;
    }
    return {
        restrict: 'A',
        scope: false,
        link: function(scope,elem,attrs) {
            var formName = elem[0].name;

            if (formName) {
                var inputs = elem.find("input"),
                    data = JSON.parse(localStorage.getItem(formName) || "{}");

                // For each input that should be persisted
                angular.forEach(inputs, function(input) {
                    if (isPersisted(input)) {
                        var attribute = input.getAttribute('ng-model');

                        scope[attribute] = data[attribute];

                        input.onchange = function() {
                            data[attribute] = input.value;
                            localStorage.setItem(formName, JSON.stringify(data));
                        };
                    }
                });

                // Clear stored item on submit
                elem.bind('submit', function() {
                    localStorage.removeItem(formName);
                });
            } else throw "Form must include name attribute to use ng-persist. ";
        }
    }
})
.directive('vgNext', function() {
  return {
    restrict: 'A',
    link: function($scope,elem,attrs) {
      elem.bind('keydown', function(e) {
        var code = e.keyCode || e.which;
        if (code === 13) {
          e.preventDefault();
          elem.nextAll('input').first().focus();
        }
      });
    }
  }
});


/*

POSSIBLE DIRECTIVES

text-overflow
currency
click-select
animations
auto-complete
type-ahead

*/