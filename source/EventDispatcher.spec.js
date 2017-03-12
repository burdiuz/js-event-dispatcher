/**
 * Created by Oleg Galaburda on 09.02.16.
 */

'use strict';


import { expect } from 'chai';
import EventDispatcher, { Event } from './EventDispatcher';

describe('EventDispatcher', () => {

  describe('isObject', () => {
    it('should return true for object', () => {
      expect(EventDispatcher.isObject({})).to.be.true;
    });
    it('should return false for null', () => {
      expect(EventDispatcher.isObject(null)).to.be.false;
    });
    it('should return false for primitive', () => {
      expect(EventDispatcher.isObject(1)).to.be.false;
      expect(EventDispatcher.isObject(1.56)).to.be.false;
      expect(EventDispatcher.isObject(true)).to.be.false;
      expect(EventDispatcher.isObject('string')).to.be.false;
    });
  });

  describe('getEvent', () => {

    describe('When event type passed', () => {
      let event = null;
      beforeEach(() => {
        event = EventDispatcher.getEvent('event-type');
      });
      it('should store event type', () => {
        expect(event.type).to.be.equal('event-type');
      });
      it('data should be null', () => {
        expect(event.data).to.be.null;
      });
    });

    describe('When event type with data passed', () => {
      let event = null;
      beforeEach(() => {
        event = EventDispatcher.getEvent('event-type', 'some data');
      });
      it('data store passed value', () => {
        expect(event.data).to.be.equal('some data');
      });
    });

    describe('When event type is\'n a string', () => {
      let event = null;
      beforeEach(() => {
        event = EventDispatcher.getEvent(256);
      });
      it('should create event object with number-string as type', () => {
        expect(event.type).to.be.equal('256');
      });
    });

    describe('When event object passed', () => {
      let event = null;
      beforeEach(() => {
        event = EventDispatcher.getEvent({ type: 'event-type', data: 'some data', value: 'some-value' });
      });
      it('should keep event object unchanged', () => {
        expect(event).to.be.eql({ type: 'event-type', data: 'some data', value: 'some-value' });
      });
    });

    describe('When event object and data passed', () => {
      let event = null;
      beforeEach(() => {
        event = EventDispatcher.getEvent({ type: 'event-type', data: 'some data' }, 'another-data');
      });
      it('should ignore passed data', () => {
        expect(event.data).to.be.equal('some data');
      });
    });

  });

  describe('create()', () => {
    it('should result in EventDispatcher instance', () => {
      expect(EventDispatcher.create()).to.be.an.instanceof(EventDispatcher);
    });
  });

  describe('create with noInit = false', () => {
    let spy;
    beforeEach(() => {
      spy = sinon.spy(EventDispatcher.prototype, 'initialize');
      new EventDispatcher(null, false);
    });
    afterEach(() => {
      spy.restore();
    });
    it('should result in EventDispatcher instance', () => {
      expect(spy).to.be.calledOnce;
    });
  });

  describe('create with noInit = true', () => {
    let spy;
    beforeEach(() => {
      spy = sinon.spy(EventDispatcher.prototype, 'initialize');
      new EventDispatcher(null, true);
    });
    afterEach(() => {
      spy.restore();
    });
    it('should result in EventDispatcher instance', () => {
      expect(spy).to.not.been.called;
    });
  });

  describe('Instance', () => {
    let dispatcher = null;
    let handlerA = null;
    let handlerAA = null;
    let handlerAAA = null;
    let handlerA1 = null;
    let handlerA_1 = null;
    let handlerB = null;
    let handlerC = null;
    beforeEach(() => {
      handlerA = sinon.spy();
      handlerAA = sinon.spy();
      handlerAAA = sinon.spy();
      handlerA1 = sinon.spy();
      handlerA_1 = sinon.spy();
      handlerB = sinon.spy();
      handlerC = sinon.spy();
      dispatcher = new EventDispatcher();
    });

    describe('When created with preprocessor', () => {
      let preprocessor, listener, dispatcher;
      beforeEach(() => {
        preprocessor = sinon.spy((event) => {
          return { type: event.type, data: 'processed' };
        });
        dispatcher = new EventDispatcher(preprocessor);
        listener = sinon.spy();
        dispatcher.addEventListener('event', listener);
      });

      describe('When dispatch by eventType', () => {
        beforeEach(() => {
          dispatcher.dispatchEvent('event', 'anything');
        });
        it('should call preprocessor', () => {
          expect(preprocessor).to.be.calledOnce;
        });
        it('preprocessor should receive one argument', () => {
          const args = preprocessor.getCall(0).args;
          expect(args).to.have.length(1);
        });
        it('preprocessor should receive event object', () => {
          const event = preprocessor.getCall(0).args[0];
          expect(event.type).to.be.equal('event');
          expect(event.data).to.be.equal('anything');
        });
        it('preprocessor should receive scope of dispatchEvent method', () => {
          expect(preprocessor).to.be.calledOn(dispatcher);
        });
        it('listener should receive processed event', () => {
          const event = listener.getCall(0).args[0];
          expect(event.data).to.be.equal('processed');
        });
      });

      describe('When dispatch by event object', () => {
        beforeEach(() => {
          dispatcher.dispatchEvent({ type: 'event', data: 'anything' });
        });
        it('preprocessor should receive event object', () => {
          const event = preprocessor.getCall(0).args[0];
          expect(event).to.be.eql({ type: 'event', data: 'anything' });
        });
        it('listener should receive processed event', () => {
          const event = listener.getCall(0).args[0];
          expect(event.data).to.be.equal('processed');
        });
      });
    });

    describe('When manage listeners', () => {
      beforeEach(() => {
        dispatcher.addEventListener('eventA', handlerA);
        dispatcher.addEventListener('eventA', handlerAA);
        dispatcher.addEventListener('eventA', handlerAAA);
        dispatcher.addEventListener('eventA', handlerA1, 1);
        dispatcher.addEventListener('eventA', handlerA_1, -1);
        dispatcher.addEventListener('eventB', handlerB);
        dispatcher.addEventListener('eventC', handlerC);
      });
      it('should store handlers after they have been added', () => {
        expect(dispatcher.hasEventListener('eventA')).to.be.true;
        expect(dispatcher.hasEventListener('eventB')).to.be.true;
        expect(dispatcher.hasEventListener('eventC')).to.be.true;
        expect(dispatcher.hasEventListener('eventD')).to.be.false;
      });
      it('should allow deleting specific listener', () => {
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
      it('should allow deleting all listeners for event type', () => {
        expect(dispatcher.hasEventListener('eventA')).to.be.true;
        dispatcher.removeAllEventListeners('eventA');
        expect(dispatcher.hasEventListener('eventA')).to.be.false;
      });

      describe('When all listeners have been deleted', () => {
        beforeEach(() => {
          dispatcher.removeAllEventListeners('eventA');
        });
        it('should tell -- no listeners for this event', () => {
          expect(dispatcher.hasEventListener('eventA')).to.be.false;
        });
        it('should not affect other events', () => {
          expect(dispatcher.hasEventListener('eventB')).to.be.true;
          expect(dispatcher.hasEventListener('eventC')).to.be.true;
          expect(dispatcher.hasEventListener('eventD')).to.be.false;
        });
        it('should allow adding new listeners', () => {
          dispatcher.addEventListener('eventA', () => {
          });
          expect(dispatcher.hasEventListener('eventA')).to.be.true;
        });
        it('should allow re-adding listeners again', () => {
          dispatcher.addEventListener('eventA', handlerA_1, -1);
          dispatcher.addEventListener('eventA', handlerA1, 1);
          dispatcher.addEventListener('eventA', handlerA);
          expect(dispatcher.hasEventListener('eventA')).to.be.true;
        });
      });

    });

    describe('When firing events', () => {

      describe('When using eventType', () => {
        beforeEach(() => {
          dispatcher.addEventListener('eventA', handlerA);
          dispatcher.dispatchEvent('eventA');
        });
        it('should call listeners', () => {
          expect(handlerA).to.have.been.calledOnce;
        });
        it('should create Event object', () => {
          const arg = handlerA.getCall(0).args[0];
          expect(arg).to.be.an.instanceof(Event);
          expect(arg.type).to.be.equal('eventA');
          expect(arg.data).to.be.null;
        });
      });

      describe('When using eventType and data', () => {
        beforeEach(() => {
          dispatcher.addEventListener('eventB', handlerB);
          dispatcher.dispatchEvent('eventB', ['any-data', 3]);
        });
        it('should store data', () => {
          const arg = handlerB.getCall(0).args[0];
          expect(arg.data).to.be.eql(['any-data', 3]);
        });
      });

      describe('When using Event instance', () => {
        let event = null;
        beforeEach(() => {
          event = new Event('eventC');
          dispatcher.addEventListener('eventC', handlerC);
          dispatcher.dispatchEvent(event);
        });
        it('should pass same object to listeners', () => {
          expect(handlerC).to.be.calledWith(event);
        });
      });

      describe('When using event object literal', () => {
        let event = null;
        beforeEach(() => {
          event = { type: 'eventC', data: 1234, bubble: false };
          dispatcher.addEventListener('eventC', handlerC);
          dispatcher.dispatchEvent(event);
        });
        it('should pass same object to listeners', () => {
          expect(handlerC).to.be.calledWith(event);
        });
        it('should keep event unchanged', () => {
          const arg = handlerC.getCall(0).args[0];
          expect(arg).to.be.eql({ type: 'eventC', data: 1234, bubble: false });
        });
      });

      describe('When no listeners registered', () => {
        it('should finish silently', () => {
          dispatcher.dispatchEvent('eventD');
        });
      });

      describe('When using multiple listeners', () => {
        let stack = null;
        beforeEach(() => {
          stack = [];
          dispatcher.addEventListener('eventA', () => {
            stack.push(1);
          });
          dispatcher.addEventListener('eventA', () => {
            stack.push(2);
          });
          dispatcher.addEventListener('eventA', () => {
            stack.push(3);
          });
          dispatcher.dispatchEvent('eventA');
        });
        it('should keep listeners order when calling', () => {
          expect(stack).to.be.eql([1, 2, 3]);
        });
      });

      describe('When using priorities', () => {
        let stack = null;
        beforeEach(() => {
          stack = [];
          dispatcher.addEventListener('eventA', () => {
            stack.push(3);
          });
          dispatcher.addEventListener('eventA', () => {
            stack.push(2);
          }, 1);
          dispatcher.addEventListener('eventA', () => {
            stack.push(4);
          }, -1);
          dispatcher.addEventListener('eventA', () => {
            stack.push(1);
          }, 100);
          dispatcher.addEventListener('eventA', () => {
            stack.push(5);
          }, -10000);
          dispatcher.dispatchEvent('eventA');
        });
        it('should keep listeners order when calling', () => {
          expect(stack).to.be.eql([1, 2, 3, 4, 5]);
        });
      });


      describe('When stopping propagation', () => {
        beforeEach(() => {
          dispatcher.addEventListener('eventA', handlerA);
          dispatcher.addEventListener('eventA', (event) => {
            event.stopPropagation();
          });
          dispatcher.addEventListener('eventA', handlerAA);
          dispatcher.addEventListener('eventA', handlerAAA);
          dispatcher.addEventListener('eventA', handlerA1, 1);
          dispatcher.addEventListener('eventA', handlerA_1, -1);
          dispatcher.dispatchEvent('eventA');
        });
        it('should stop after processing all listeners of same priority', () => {
          expect(handlerA1).to.be.calledOnce;
          expect(handlerA).to.be.calledOnce;
          expect(handlerAA).to.be.calledOnce;
          expect(handlerAAA).to.be.calledOnce;
          expect(handlerA_1).to.not.be.called;
        });
      });

      describe('When stopping immediate propagation', () => {
        beforeEach(() => {
          dispatcher.addEventListener('eventA', handlerA);
          dispatcher.addEventListener('eventA', (event) => {
            event.stopImmediatePropagation();
          });
          dispatcher.addEventListener('eventA', handlerAA);
          dispatcher.addEventListener('eventA', handlerAAA);
          dispatcher.addEventListener('eventA', handlerA1, 1);
          dispatcher.addEventListener('eventA', handlerA_1, -1);
          dispatcher.dispatchEvent('eventA');
        });
        it('should stop immediately, dropping all next listeners', () => {
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
