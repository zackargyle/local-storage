

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

vgDraggable: Make an element draggable
    dragOptions = {
      containment: '',   --- Element id for containment
      start: function(), --- Function to call on start
      stop:  function(), --- Function to call on stop
      drag:  function(), --- Function to call on move
    }
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
    link: function(scope,elem,attrs) {
      elem.bind('keydown', function(e) {
        var code = e.keyCode || e.which;
        if (code === 13) {
          e.preventDefault();
          elem.nextAll('input').first().focus();
        }
      });
    }
  }
})
.directive('vgDraggable', function($document) {
  return {
    restrict: 'A',
    scope: {
      dragOptions: '=vgDraggable'
    },
    link: function(scope, elem, attr) {
      var startX, startY, x = 0, y = 0,
          start, stop, drag, container;

      var width  = elem[0].offsetWidth,
          height = elem[0].offsetHeight;
      
      // Obtain drag options
      if (scope.dragOptions) {
        start  = scope.dragOptions.start;
        drag   = scope.dragOptions.drag;
        stop   = scope.dragOptions.stop;
        var id = scope.dragOptions.container;
        container = document.getElementById(id).getBoundingClientRect();
      }

      // Bind mousedown event
      elem.on('mousedown', function(e) {
        e.preventDefault();
        startX = e.clientX - elem[0].offsetLeft;
        startY = e.clientY - elem[0].offsetTop;
        $document.on('mousemove', mousemove);
        $document.on('mouseup', mouseup);
        if (start) start(e);
      });

      // Handle drag event
      function mousemove(e) {
        y = e.clientY - startY;
        x = e.clientX - startX;
        setPosition();
        if (drag) drag(e);
      }

      // Unbind drag events
      function mouseup(e) {
        $document.unbind('mousemove', mousemove);
        $document.unbind('mouseup', mouseup);
        if (stop) stop(e);
      }

      // Move element, within container if provided
      function setPosition() {
        if (container) {
          if (x < container.left) {
            x = container.left;
          } else if (x > container.right - width) {
            x = container.right - width;
          }
          if (y < container.top) {
            y = container.top;
          } else if (y > container.bottom - height) {
            y = container.bottom - height;
          }
        }

        elem.css({
          top: y + 'px',
          left:  x + 'px'
        });
      }
    }
  }

})

.controller('ctrl', function($scope) { 
    $scope.dragOptions = {
        start: function(e) {
          console.log("STARTING");
        },
        // drag: function(e) {
        //   console.log("DRAGGING");
        // },
        stop: function(e) {
          console.log("STOPPING");
        },
        container: 'body'
    }

});