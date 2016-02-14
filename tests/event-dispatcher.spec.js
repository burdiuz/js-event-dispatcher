/**
 * Created by Oleg Galaburda on 09.02.16.
 */
describe('EventDispatcher', function() {
  describe('Event', function() {
    var event = '';
    var data = '';
    var type = '';
    beforeEach(function() {
      data = {value: false};
      type = 'someEventType';
      event = new Event(type, data);
    });
    it('should have type', function() {
      expect(event.type).to.be.equal(type);
    });
    it('should have data', function() {
      expect(event.data).to.be.equal(data);
    });

    describe('preventDefault()', function() {
      it('should not be prevented from init', function() {
        expect(event.isDefaultPrevented()).to.be.false;
      });

      describe('When called', function() {
        beforeEach(function() {
          event.preventDefault();
        });
        it('should become prevented', function() {
          expect(event.isDefaultPrevented()).to.be.true;
        });
      });
    });

    describe('toJSON()', function() {
      it('should include only type and data', function() {
        expect(event.toJSON()).to.be.eql({
          data: {value: false},
          type: 'someEventType'
        });
      });
    });

    describe('When dispatched', function() {
      var dispatcher;
      var event;
      beforeEach(function() {
        dispatcher = new EventDispatcher();
        event = new Event('anyEvent');
      });
      it('should have stopPropagation()', function() {
        dispatcher.addEventListener(event.type, function() {
          expect(event.stopPropagation).to.be.an.instanceof(Function);
        });
        dispatcher.dispatchEvent(event);
        expect(event.stopPropagation).to.be.undefined;
      });
      it('should have stopImmediatePropagation()', function() {
        dispatcher.addEventListener(event.type, function() {
          expect(event.stopImmediatePropagation).to.be.an.instanceof(Function);
        });
        dispatcher.dispatchEvent(event);
        expect(event.stopImmediatePropagation).to.be.undefined;
      });
    });

  });

  describe('isObject', function() {
    it('should return true for object', function() {
      expect(EventDispatcher.isObject({})).to.be.true;
    });
    it('should return false for null', function() {
      expect(EventDispatcher.isObject(null)).to.be.false;
    });
    it('should return false for primitive', function() {
      expect(EventDispatcher.isObject(1)).to.be.false;
      expect(EventDispatcher.isObject(1.56)).to.be.false;
      expect(EventDispatcher.isObject(true)).to.be.false;
      expect(EventDispatcher.isObject('string')).to.be.false;
    });
  });

  describe('getEvent', function() {

    describe('When event type passed', function() {
      var event = null;
      beforeEach(function() {
        event = EventDispatcher.getEvent('event-type');
      });
      it('should store event type', function() {
        expect(event.type).to.be.equal('event-type');
      });
      it('data should be null', function() {
        expect(event.data).to.be.null;
      });
    });

    describe('When event type with data passed', function() {
      var event = null;
      beforeEach(function() {
        event = EventDispatcher.getEvent('event-type', 'some data');
      });
      it('data store passed value', function() {
        expect(event.data).to.be.equal('some data');
      });
    });

    describe('When event type is\'n a string', function() {
      var event = null;
      beforeEach(function() {
        event = EventDispatcher.getEvent(256);
      });
      it('should create event object with number-string as type', function() {
        expect(event.type).to.be.equal('256');
      });
    });

    describe('When event object passed', function() {
      var event = null;
      beforeEach(function() {
        event = EventDispatcher.getEvent({type: 'event-type', data: 'some data', value: 'some-value'});
      });
      it('should keep event object unchanged', function() {
        expect(event).to.be.eql({type: 'event-type', data: 'some data', value: 'some-value'});
      });
    });

    describe('When event object and data passed', function() {
      var event = null;
      beforeEach(function() {
        event = EventDispatcher.getEvent({type: 'event-type', data: 'some data'}, 'another-data');
      });
      it('should ignore passed data', function() {
        expect(event.data).to.be.equal('some data');
      });
    });

  });

  describe('Instance', function() {
    var dispatcher = null;
    var handlerA = null;
    var handlerAA = null;
    var handlerAAA = null;
    var handlerA1 = null;
    var handlerA_1 = null;
    var handlerB = null;
    var handlerC = null;
    beforeEach(function() {
      handlerA = sinon.spy();
      handlerAA = sinon.spy();
      handlerAAA = sinon.spy();
      handlerA1 = sinon.spy();
      handlerA_1 = sinon.spy();
      handlerB = sinon.spy();
      handlerC = sinon.spy();
      dispatcher = new EventDispatcher();
    });

    describe('When manage listeners', function() {
      beforeEach(function() {
        dispatcher.addEventListener('eventA', handlerA);
        dispatcher.addEventListener('eventA', handlerAA);
        dispatcher.addEventListener('eventA', handlerAAA);
        dispatcher.addEventListener('eventA', handlerA1, 1);
        dispatcher.addEventListener('eventA', handlerA_1, -1);
        dispatcher.addEventListener('eventB', handlerB);
        dispatcher.addEventListener('eventC', handlerC);
      });
      it('should store handlers after they have been added', function() {
        expect(dispatcher.hasEventListener('eventA')).to.be.true;
        expect(dispatcher.hasEventListener('eventB')).to.be.true;
        expect(dispatcher.hasEventListener('eventC')).to.be.true;
        expect(dispatcher.hasEventListener('eventD')).to.be.false;
      });
      it('should allow deleting specific listener', function() {
        dispatcher.removeEventListener('eventA', handlerA);
        expect(dispatcher.hasEventListener('eventA')).to.be.true;
        dispatcher.removeEventListener('eventA', handlerAA);
        expect(dispatcher.hasEventListener('eventA')).to.be.true;
        dispatcher.removeEventListener('eventA', handlerAAA);
        expect(dispatcher.hasEventListener('eventA')).to.be.true;
        dispatcher.removeEventListener('eventA', handlerA1);
        expect(dispatcher.hasEventListener('eventA')).to.be.true;
        dispatcher.removeEventListener('eventA', handlerA_1);
        expect(dispatcher.hasEventListener('eventA')).to.be.false;
      });
      it('should allow deleting all listeners for event type', function() {
        expect(dispatcher.hasEventListener('eventA')).to.be.true;
        dispatcher.removeAllEventListeners('eventA');
        expect(dispatcher.hasEventListener('eventA')).to.be.false;
      });

      describe('When all listeners have been deleted', function() {
        beforeEach(function() {
          dispatcher.removeAllEventListeners('eventA');
        });
        it('should tell -- no listeners for this event', function() {
          expect(dispatcher.hasEventListener('eventA')).to.be.false;
        });
        it('should not affect other events', function() {
          expect(dispatcher.hasEventListener('eventB')).to.be.true;
          expect(dispatcher.hasEventListener('eventC')).to.be.true;
          expect(dispatcher.hasEventListener('eventD')).to.be.false;
        });
        it('should allow adding new listeners', function() {
          dispatcher.addEventListener('eventA', function() {
          });
          expect(dispatcher.hasEventListener('eventA')).to.be.true;
        });
        it('should allow re-adding listeners again', function() {
          dispatcher.addEventListener('eventA', handlerA_1, -1);
          dispatcher.addEventListener('eventA', handlerA1, 1);
          dispatcher.addEventListener('eventA', handlerA);
          expect(dispatcher.hasEventListener('eventA')).to.be.true;
        });
      });

    });

    describe('When firing events', function() {

      describe('When using eventType', function() {
        beforeEach(function() {
          dispatcher.addEventListener('eventA', handlerA);
          dispatcher.dispatchEvent('eventA');
        });
        it('should call listeners', function() {
          expect(handlerA).to.have.been.calledOnce;
        });
        it('should create Event object', function() {
          var arg = handlerA.getCall(0).args[0];
          expect(arg).to.be.an.instanceof(EventDispatcher.Event);
          expect(arg.type).to.be.equal('eventA');
          expect(arg.data).to.be.null;
        });
      });

      describe('When using eventType and data', function() {
        beforeEach(function() {
          dispatcher.addEventListener('eventB', handlerB);
          dispatcher.dispatchEvent('eventB', ['any-data', 3]);
        });
        it('should store data', function() {
          var arg = handlerB.getCall(0).args[0];
          expect(arg.data).to.be.eql(['any-data', 3]);
        });
      });

      describe('When using Event instance', function() {
        var event = null;
        beforeEach(function() {
          event = new Event('eventC');
          dispatcher.addEventListener('eventC', handlerC);
          dispatcher.dispatchEvent(event);
        });
        it('should pass same object to listeners', function() {
          expect(handlerC).to.be.calledWith(event);
        });
      });

      describe('When using event object literal', function() {
        var event = null;
        beforeEach(function() {
          event = {type: 'eventC', data: 1234, bubble: false};
          dispatcher.addEventListener('eventC', handlerC);
          dispatcher.dispatchEvent(event);
        });
        it('should pass same object to listeners', function() {
          expect(handlerC).to.be.calledWith(event);
        });
        it('should keep event unchanged', function() {
          var arg = handlerC.getCall(0).args[0];
          expect(arg).to.be.eql({type: 'eventC', data: 1234, bubble: false});
        });
      });

      describe('When no listeners registered', function() {
        it('should finish silently', function() {
          dispatcher.dispatchEvent('eventD');
        });
      });

      describe('When using multiple listeners', function() {
        var stack = null;
        beforeEach(function() {
          stack = [];
          dispatcher.addEventListener('eventA', function() {
            stack.push(1);
          });
          dispatcher.addEventListener('eventA', function() {
            stack.push(2);
          });
          dispatcher.addEventListener('eventA', function() {
            stack.push(3);
          });
          dispatcher.dispatchEvent('eventA');
        });
        it('should keep listeners order when calling', function() {
          expect(stack).to.be.eql([1, 2, 3]);
        });
      });

      describe('When using priorities', function() {
        var stack = null;
        beforeEach(function() {
          stack = [];
          dispatcher.addEventListener('eventA', function() {
            stack.push(3);
          });
          dispatcher.addEventListener('eventA', function() {
            stack.push(2);
          }, 1);
          dispatcher.addEventListener('eventA', function() {
            stack.push(4);
          }, -1);
          dispatcher.addEventListener('eventA', function() {
            stack.push(1);
          }, 100);
          dispatcher.addEventListener('eventA', function() {
            stack.push(5);
          }, -10000);
          dispatcher.dispatchEvent('eventA');
        });
        it('should keep listeners order when calling', function() {
          expect(stack).to.be.eql([1, 2, 3, 4, 5]);
        });
      });


      describe('When stopping propagation', function() {
        beforeEach(function() {
          dispatcher.addEventListener('eventA', handlerA);
          dispatcher.addEventListener('eventA', function(event) {
            event.stopPropagation();
          });
          dispatcher.addEventListener('eventA', handlerAA);
          dispatcher.addEventListener('eventA', handlerAAA);
          dispatcher.addEventListener('eventA', handlerA1, 1);
          dispatcher.addEventListener('eventA', handlerA_1, -1);
          dispatcher.dispatchEvent('eventA');
        });
        it('should stop after processing all listeners of same priority', function() {
          expect(handlerA1).to.be.calledOnce;
          expect(handlerA).to.be.calledOnce;
          expect(handlerAA).to.be.calledOnce;
          expect(handlerAAA).to.be.calledOnce;
          expect(handlerA_1).to.not.be.called;
        });
      });

      describe('When stopping immediate propagation', function() {
        beforeEach(function() {
          dispatcher.addEventListener('eventA', handlerA);
          dispatcher.addEventListener('eventA', function(event) {
            event.stopImmediatePropagation();
          });
          dispatcher.addEventListener('eventA', handlerAA);
          dispatcher.addEventListener('eventA', handlerAAA);
          dispatcher.addEventListener('eventA', handlerA1, 1);
          dispatcher.addEventListener('eventA', handlerA_1, -1);
          dispatcher.dispatchEvent('eventA');
        });
        it('should stop immediately, dropping all next listeners', function() {
          expect(handlerA1).to.be.calledOnce;
          expect(handlerA).to.be.calledOnce;
          expect(handlerAA).to.not.be.called;
          expect(handlerAAA).to.not.be.called;
          expect(handlerA_1).to.not.be.called;
        });
      });

    });
  });
});
