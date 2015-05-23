/*jshint -W098 */
'use strict';
describe('angular-jssignals', function() {
  var signalservice, SignalServiceProvider, $compile, $scope, $log, oInjectedForSpies = {};
  var thesignalskeys = {
    ITEMADDED: 'itemadded',
    ITEMREMOVED: 'itemremoved'
  };
  //console.log('JASMINE');
  /**
   * Get the module before each test
   * - configure service provider
   */
  beforeEach(module('SignalServiceModule', function( _SignalServiceProvider_ ) {
    SignalServiceProvider = _SignalServiceProvider_;
    SignalServiceProvider.config(thesignalskeys);
  }));

  /**
   * Inject dependencies before each test
   */
  /*beforeEach(inject(function (_$rootScope_, _$compile_, _$log_) {
      $scope = _$rootScope_.$new();
      $compile = _$compile_;
      oInjectedForSpies.$log = _$log_;
  }));*/

  beforeEach(function() {
    inject(function( _SignalService_ ) {
      signalservice = _SignalService_;

    });
  });

  afterEach(function( done ) {
    done();
  });

  /**
   * Test Suites
   */
  describe('Test service definition and configuration ==> ', function() {
    it('service should be defined', function() {
      expect(signalservice).toBeDefined();
    });
    it('should have signals configured', function() {
      expect(signalservice.SIGNALS).toEqual(thesignalskeys);
    });
  });
  describe('Test service functionality ==> ', function() {
    var value;

    function callOnItemAdded( data ) {
      value = data.value;
      //expect(data.value).toBe('called');
    }

    function callOnItemRemoved( data ) {
      value = data.value;
      //expect(data.value).toBe('called');
    }

    beforeEach(function() {
      value = undefined;
    });

    afterEach(function() {
      try {
        signalservice.unlisten(signalservice.SIGNALS.ITEMADDED, callOnItemAdded);
        signalservice.unlisten(signalservice.SIGNALS.ITEMREMOVED, callOnItemRemoved);
      } catch( e ) {
      }
    });

    it('should call registered callback on emit event', function( done ) {
      signalservice.listen(signalservice.SIGNALS.ITEMADDED, callOnItemAdded);
      signalservice.emit(signalservice.SIGNALS.ITEMADDED, {value: 'called'});

      setTimeout(function() {
        expect(value).toBe('called');
        done();
      });
    });

    it('should evaluate if listeners are registered', function() {
      function IamNotListening() {
      }

      signalservice.listen(signalservice.SIGNALS.ITEMADDED, callOnItemAdded);
      expect(signalservice.isListening(signalservice.SIGNALS.ITEMADDED, callOnItemAdded)).toBeTruthy();
      expect(signalservice.isListening(signalservice.SIGNALS.ITEMADDED, IamNotListening)).toBeFalsy();
    });

    it('should evaluate number of listeners that are registered', function() {
      function IamListening() {
      }

      expect(signalservice.getNumListeners(signalservice.SIGNALS.ITEMADDED)).toBe(0);
      signalservice.listen(signalservice.SIGNALS.ITEMADDED, callOnItemAdded);
      expect(signalservice.getNumListeners(signalservice.SIGNALS.ITEMADDED)).toBe(1);
      signalservice.listen(signalservice.SIGNALS.ITEMADDED, IamListening);
      expect(signalservice.getNumListeners(signalservice.SIGNALS.ITEMADDED)).toBe(2);
    });

    it('should call registered callback on emit event more than once', function( done ) {
      signalservice.listen(signalservice.SIGNALS.ITEMADDED, callOnItemAdded);
      signalservice.emit(signalservice.SIGNALS.ITEMADDED, {value: 'called'});

      setTimeout(function() {
        expect(value).toBe('called');
        value = undefined;
        signalservice.emit(signalservice.SIGNALS.ITEMADDED, {value: 'called'});
        setTimeout(function() {
          expect(value).toBe('called');
          done();
        });
      });
    });

    it('should go quietly on listen/emit event with invalid key', function( done ) {
      var invalidKey = 'invalid-key-event';
      signalservice.listen(invalidKey, callOnItemAdded);
      signalservice.emit(invalidKey, {value: 'called'});

      setTimeout(function() {
        expect(value).not.toBeDefined();
        done();
      });
    });

    it('should not call registered callback on emit event after unlisten', function( done ) {
      signalservice.listen(signalservice.SIGNALS.ITEMADDED, callOnItemAdded);
      signalservice.emit(signalservice.SIGNALS.ITEMADDED, {value: 'called'});

      setTimeout(function() {
        expect(value).toBe('called');
        value = undefined;
        signalservice.unlisten(signalservice.SIGNALS.ITEMADDED, callOnItemAdded);
        signalservice.emit(signalservice.SIGNALS.ITEMADDED, {value: 'called'});

        setTimeout(function() {
          expect(value).not.toBeDefined();
          done();
        });

      });
    });

    it('should clear things on dispose', function( done ) {

      signalservice.listen(signalservice.SIGNALS.ITEMADDED, callOnItemAdded);
      var theSignal1 = signalservice.get(signalservice.SIGNALS.ITEMADDED);

      signalservice.emit(signalservice.SIGNALS.ITEMADDED, {value: 'called'});

      setTimeout(function() {
        expect(value).toBe('called');
        value = undefined;

        signalservice.dispose(signalservice.SIGNALS.ITEMADDED);

        signalservice.emit(signalservice.SIGNALS.ITEMADDED, {value: 'called'});
        var theSignal2 = signalservice.get(signalservice.SIGNALS.ITEMADDED);

        setTimeout(function() {
          //since dispose clear listeners the listener should not be called even if the signal is recreated on the second emit
          //and signals should be different
          expect(value).not.toBeDefined();
          expect(theSignal1).not.toEqual(theSignal2);
          done();
        });

      });
    });

    it('should call registered callback only once on emit event', function( done ) {
      var value = 0;

      function callOnItemAdded( data ) {
        value++;
      }

      signalservice.listen(signalservice.SIGNALS.ITEMADDED, callOnItemAdded, {addOnce: true});
      signalservice.emit(signalservice.SIGNALS.ITEMADDED, {});
      setTimeout(function() {
        expect(value).toBe(1);
        signalservice.emit(signalservice.SIGNALS.ITEMADDED, {});
        setTimeout(function() {
          expect(value).toBe(1);
          done();
        });
      });
    });

    it('should call registered callback by order on emit event', function( done ) {
      var value = 1;

      function callOnEventAdd3() {
        value += 3;
      }

      function callOnEventDivideBy2() {
        value = value / 2;
      }

      signalservice.listen(signalservice.SIGNALS.ITEMADDED, callOnEventAdd3);
      signalservice.listen(signalservice.SIGNALS.ITEMADDED, callOnEventDivideBy2);
      signalservice.emit(signalservice.SIGNALS.ITEMADDED, {});

      setTimeout(function() {
        expect(value).toBe(2);
        done();
      });
    });

    it('should call registered callback by priority on emit event', function( done ) {
      var value = 1;

      function callOnEventAdd3() {
        value += 3;
      }

      function callOnEventDivideBy2() {
        value = value / 2;
      }

      signalservice.listen(signalservice.SIGNALS.ITEMADDED, callOnEventAdd3);
      signalservice.listen(signalservice.SIGNALS.ITEMADDED, callOnEventDivideBy2, {priority: 1});
      signalservice.emit(signalservice.SIGNALS.ITEMADDED, {});

      setTimeout(function() {
        expect(value).toBe(3.5);
        done();
      });
    });

    it('should call registered callback on emit event with context', function( done ) {
      /*jshint validthis:true*/
      function callOnItemAdded() {
        value = this;
      }

      signalservice.listen(signalservice.SIGNALS.ITEMADDED, callOnItemAdded, {listenerContext: {me: true}});
      signalservice.emit(signalservice.SIGNALS.ITEMADDED, {value: 'called'});

      setTimeout(function() {
        expect(value).toBeDefined();
        expect(value.me).toBeTruthy();
        done();
      });
    });

    it('should allow for curry arguments', function( done ) {
      /*jshint validthis:true*/
      function callOnItemAdded( from, name ) {
        value = from + name;
      }

      var signalbinding = signalservice.listen(signalservice.SIGNALS.ITEMADDED, callOnItemAdded);
      signalbinding.params = [ 'From John: ' ];
      signalservice.emit(signalservice.SIGNALS.ITEMADDED, 'Hi!');

      setTimeout(function() {
        expect(value).toBe('From John: Hi!');
        done();
      });
    });

    it('should allow for remove correct listener/context', function( done ) {
      var value = 0;
      /*jshint validthis:true*/
      function callOnItemAdded( data ) {
        value += this.me;
      }

      //each context add its me property to value variable
      var context1 = {me: 1}, context2 = {me: 2}, context3 = {me: 3}, context4 = {me: -10};
      signalservice.listen(signalservice.SIGNALS.ITEMADDED, callOnItemAdded, {listenerContext: context1});
      signalservice.listen(signalservice.SIGNALS.ITEMADDED, callOnItemAdded, {listenerContext: context2});
      signalservice.emit(signalservice.SIGNALS.ITEMADDED, {});

      setTimeout(function() {
        expect(value).toBe(3);
        signalservice.unlisten(signalservice.SIGNALS.ITEMADDED, callOnItemAdded, {listenerContext: context1});
        signalservice.emit(signalservice.SIGNALS.ITEMADDED, {});

        setTimeout(function() {
          expect(value).toBe(5);
          signalservice.listen(signalservice.SIGNALS.ITEMADDED, callOnItemAdded, {listenerContext: context3});
          signalservice.emit(signalservice.SIGNALS.ITEMADDED, {});

          setTimeout(function() {
            expect(value).toBe(10);
            signalservice.unlisten(signalservice.SIGNALS.ITEMADDED, callOnItemAdded, {listenerContext: context2});
            signalservice.unlisten(signalservice.SIGNALS.ITEMADDED, callOnItemAdded, {listenerContext: context3});
            signalservice.listen(signalservice.SIGNALS.ITEMADDED, callOnItemAdded, {listenerContext: context4});
            signalservice.emit(signalservice.SIGNALS.ITEMADDED, {});

            setTimeout(function() {
              expect(value).toBe(0);
              done();
            });
          });
        });
      });
    });

    it('should remove all listeners', function( done ) {
      var value = 0;
      /*jshint validthis:true*/
      function callOnItemAdded1() {
        value++;
      }

      function callOnItemAdded2() {
        value++;
      }

      signalservice.listen(signalservice.SIGNALS.ITEMADDED, callOnItemAdded1);
      signalservice.listen(signalservice.SIGNALS.ITEMADDED, callOnItemAdded2);
      signalservice.emit(signalservice.SIGNALS.ITEMADDED, {});

      setTimeout(function() {
        expect(value).toBe(2);
        value = 0;
        signalservice.unlistenAll(signalservice.SIGNALS.ITEMADDED);
        signalservice.emit(signalservice.SIGNALS.ITEMADDED, {});

        setTimeout(function() {
          expect(value).toBe(0);
          done();
        });
      });
    });

    it('should memorize params emited and forget should work', function( done ) {
      var value = 0;
      /*jshint validthis:true*/

      signalservice.listen(signalservice.SIGNALS.ITEMADDED, function( v ) {
        value += v;
      });

      var signal = signalservice.get(signalservice.SIGNALS.ITEMADDED);
      signal.memorize = true;

      signalservice.emit(signalservice.SIGNALS.ITEMADDED, 1);

      setTimeout(function() {
        //first listener increments 1
        expect(value).toBe(1);

        signalservice.listen(signalservice.SIGNALS.ITEMADDED, function( v ) {
          value += (2 * v);
        });

        setTimeout(function() {
          //second listener increments 2 (last emit v=1 was memorized)
          expect(value).toBe(3);

          signalservice.emit(signalservice.SIGNALS.ITEMADDED, 2);

          setTimeout(function() {
            //first listener increments 2 v=2
            //second listener increments 4 --> 2*v
            expect(value).toBe(9);

            signalservice.emit(signalservice.SIGNALS.ITEMADDED, 3);
            //first listener increments 3 v=3
            //second listener increments 6 --> 2*v
            //here value=18

            signalservice.listen(signalservice.SIGNALS.ITEMADDED, function( v ) {
              value += (-6 * v);
            });
            setTimeout(function() {
              //third listen receives last memorized 3
              //decrements 18 v=3 ---> 6*v
              expect(value).toBe(0);

              signalservice.forget(signalservice.SIGNALS.ITEMADDED);

              //as forget as called the last emit value is forgotted and this listen is not automatically called with than tvalue (3)
              signalservice.listen(signalservice.SIGNALS.ITEMADDED, function( v ) {
                value += 3 * v;
              });

              signalservice.emit(signalservice.SIGNALS.ITEMADDED, 4);

              setTimeout(function() {
                //first listener increments 4 value=4
                //second listener increments 2*4 value=12
                //third listener decrements -6*4 value=-12
                //fourth listener increments 3*4 value=0
                expect(value).toBe(0);

                done();
              });
            });
          });
        });
      });
    });
  });

  // This is the equivalent of the old waitsFor/runs syntax
  // which was removed from Jasmine 2
  // Credits: https://gist.github.com/abreckner/110e28897d42126a3bb9
  var waitsForAndRuns = function( escapeFunction, runFunction, escapeTime ) {
    if ( escapeFunction() ) {
      runFunction();
      return;
    }
    // check the escapeFunction every millisecond so as soon as it is met we can escape the function
    var interval = setInterval(function() {
      if ( escapeFunction() ) {
        clearMe();
        runFunction();
      }
    }, 1);
    // in case we never reach the escapeFunction, we will time out
    // at the escapeTime
    var timeOut = setTimeout(function() {
      clearMe();
      runFunction();
    }, escapeTime);
    // clear the interval and the timeout
    function clearMe() {
      clearInterval(interval);
      clearTimeout(timeOut);
    }
  };
});
