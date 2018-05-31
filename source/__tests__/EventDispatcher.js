/**
 * Created by Oleg Galaburda on 09.02.16.
 */

import { EventDispatcher, Event } from '../index';

describe('EventDispatcher', () => {
  describe('isObject', () => {
    it('should return true for object', () => {
      expect(EventDispatcher.isObject({})).toBe(true);
    });

    it('should return false for null', () => {
      expect(EventDispatcher.isObject(null)).toBe(false);
    });

    it('should return false for primitive', () => {
      expect(EventDispatcher.isObject(1)).toBe(false);
      expect(EventDispatcher.isObject(1.56)).toBe(false);
      expect(EventDispatcher.isObject(true)).toBe(false);
      expect(EventDispatcher.isObject('string')).toBe(false);
    });
  });

  describe('getEvent', () => {
    describe('When event type passed', () => {
      let event = null;

      beforeEach(() => {
        event = EventDispatcher.getEvent('event-type');
      });

      it('should store event type', () => {
        expect(event.type).toBe('event-type');
      });

      it('data should be null', () => {
        expect(event.data).toBeNull();
      });
    });

    describe('When event type with data passed', () => {
      let event = null;

      beforeEach(() => {
        event = EventDispatcher.getEvent('event-type', 'some data');
      });

      it('data store passed value', () => {
        expect(event.data).toBe('some data');
      });
    });

    describe("When event type is'n a string", () => {
      let event = null;

      beforeEach(() => {
        event = EventDispatcher.getEvent(256);
      });

      it('should create event object with number-string as type', () => {
        expect(event.type).toBe('256');
      });
    });

    describe('When event object passed', () => {
      let event = null;

      beforeEach(() => {
        event = EventDispatcher.getEvent({
          type: 'event-type',
          data: 'some data',
          value: 'some-value',
        });
      });

      it('should keep event object unchanged', () => {
        expect(event).toEqual({
          type: 'event-type',
          data: 'some data',
          value: 'some-value',
        });
      });
    });

    describe('When event object and data passed', () => {
      let event = null;

      beforeEach(() => {
        event = EventDispatcher.getEvent(
          {
            type: 'event-type',
            data: 'some data',
          },
          'another-data',
        );
      });

      it('should ignore passed data', () => {
        expect(event.data).toBe('some data');
      });
    });
  });

  describe('create()', () => {
    it('should result in EventDispatcher instance', () => {
      expect(EventDispatcher.create()).toBeInstanceOf(EventDispatcher);
    });
  });

  describe('create with noInit = false', () => {
    let spy;

    beforeEach(() => {
      spy = jest.spyOn(EventDispatcher.prototype, 'initialize');
      (() => null)(new EventDispatcher(null, false));
    });

    afterEach(() => {
      spy.mockRestore();
    });

    it('should result in EventDispatcher instance', () => {
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('create with noInit = true', () => {
    let spy;

    beforeEach(() => {
      spy = jest.spyOn(EventDispatcher.prototype, 'initialize');
      (() => null)(new EventDispatcher(null, true));
    });

    afterEach(() => {
      spy.mockRestore();
    });

    it('should result in EventDispatcher instance', () => {
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('Instance', () => {
    let dispatcher = null;
    let handlerA = null;
    let handlerAA = null;
    let handlerAAA = null;
    let handlerA1 = null;
    let handlerAminus1 = null;
    let handlerB = null;
    let handlerC = null;

    beforeEach(() => {
      handlerA = jest.fn();
      handlerAA = jest.fn();
      handlerAAA = jest.fn();
      handlerA1 = jest.fn();
      handlerAminus1 = jest.fn();
      handlerB = jest.fn();
      handlerC = jest.fn();
      dispatcher = new EventDispatcher();
    });

    describe('When created with preprocessor', () => {
      let preprocessor;
      let target;
      let listener;

      function mockPreprocessor(event) {
        target = this;

        return {
          type: event.type,
          data: 'processed',
        };
      }

      beforeEach(() => {
        preprocessor = jest.fn(mockPreprocessor);
        dispatcher = new EventDispatcher(preprocessor);
        listener = jest.fn();
        dispatcher.addEventListener('event', listener);
      });

      describe('When dispatch by eventType', () => {
        beforeEach(() => {
          dispatcher.dispatchEvent('event', 'anything');
        });

        it('should call preprocessor', () => {
          expect(preprocessor).toHaveBeenCalledTimes(1);
          expect(preprocessor).toHaveBeenCalledWith(expect.objectContaining({
            type: 'event',
            data: 'anything',
          }));
        });

        it('preprocessor should receive scope of dispatchEvent method', () => {
          expect(target).toBe(dispatcher);
        });

        it('listener should receive processed event', () => {
          expect(listener).toHaveBeenCalledTimes(1);
          expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            data: 'processed',
          }));
        });
      });

      describe('When dispatch by event object', () => {
        beforeEach(() => {
          dispatcher.dispatchEvent({ type: 'event', data: 'anything' });
        });

        it('preprocessor should receive event object', () => {
          expect(preprocessor).toHaveBeenCalledTimes(1);
          expect(preprocessor).toHaveBeenCalledWith(expect.objectContaining({
            type: 'event',
            data: 'anything',
          }));
        });

        it('listener should receive processed event', () => {
          expect(listener).toHaveBeenCalledTimes(1);
          expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            data: 'processed',
          }));
        });
      });
    });

    describe('When manage listeners', () => {
      beforeEach(() => {
        dispatcher.addEventListener('eventA', handlerA);
        dispatcher.addEventListener('eventA', handlerAA);
        dispatcher.addEventListener('eventA', handlerAAA);
        dispatcher.addEventListener('eventA', handlerA1, 1);
        dispatcher.addEventListener('eventA', handlerAminus1, -1);
        dispatcher.addEventListener('eventB', handlerB);
        dispatcher.addEventListener('eventC', handlerC);
      });

      it('should store handlers after they have been added', () => {
        expect(dispatcher.hasEventListener('eventA')).toBe(true);
        expect(dispatcher.hasEventListener('eventB')).toBe(true);
        expect(dispatcher.hasEventListener('eventC')).toBe(true);
        expect(dispatcher.hasEventListener('eventD')).toBe(false);
      });

      it('should allow deleting specific listener', () => {
        dispatcher.removeEventListener('eventA', handlerA);
        expect(dispatcher.hasEventListener('eventA')).toBe(true);
        dispatcher.removeEventListener('eventA', handlerAA);
        expect(dispatcher.hasEventListener('eventA')).toBe(true);
        dispatcher.removeEventListener('eventA', handlerAAA);
        expect(dispatcher.hasEventListener('eventA')).toBe(true);
        dispatcher.removeEventListener('eventA', handlerA1);
        expect(dispatcher.hasEventListener('eventA')).toBe(true);
        dispatcher.removeEventListener('eventA', handlerAminus1);
        expect(dispatcher.hasEventListener('eventA')).toBe(false);
      });

      it('should allow deleting all listeners for event type', () => {
        expect(dispatcher.hasEventListener('eventA')).toBe(true);
        dispatcher.removeAllEventListeners('eventA');
        expect(dispatcher.hasEventListener('eventA')).toBe(false);
      });

      describe('When all listeners have been deleted', () => {
        beforeEach(() => {
          dispatcher.removeAllEventListeners('eventA');
        });

        it('should tell -- no listeners for this event', () => {
          expect(dispatcher.hasEventListener('eventA')).toBe(false);
        });

        it('should not affect other events', () => {
          expect(dispatcher.hasEventListener('eventB')).toBe(true);
          expect(dispatcher.hasEventListener('eventC')).toBe(true);
          expect(dispatcher.hasEventListener('eventD')).toBe(false);
        });

        it('should allow adding new listeners', () => {
          dispatcher.addEventListener('eventA', () => {});
          expect(dispatcher.hasEventListener('eventA')).toBe(true);
        });

        it('should allow re-adding listeners again', () => {
          dispatcher.addEventListener('eventA', handlerAminus1, -1);
          dispatcher.addEventListener('eventA', handlerA1, 1);
          dispatcher.addEventListener('eventA', handlerA);
          expect(dispatcher.hasEventListener('eventA')).toBe(true);
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
          expect(handlerA).toHaveBeenCalledTimes(1);
        });

        it('should create Event object', () => {
          const arg = handlerA.mock.calls[0][0];
          expect(arg).toBeInstanceOf(Event);
          expect(arg.type).toBe('eventA');
          expect(arg.data).toBeNull();
        });
      });

      describe('When using eventType and data', () => {
        beforeEach(() => {
          dispatcher.addEventListener('eventB', handlerB);
          dispatcher.dispatchEvent('eventB', ['any-data', 3]);
        });

        it('should store data', () => {
          expect(handlerB).toHaveBeenCalledWith(expect.objectContaining({
            data: ['any-data', 3],
          }));
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
          expect(handlerC).toHaveBeenCalledWith(event);
        });
      });

      describe('When using event object literal', () => {
        let event = null;

        beforeEach(() => {
          event = { type: 'eventC', data: 1234, bubble: false };
          dispatcher.addEventListener('eventC', handlerC);
          dispatcher.dispatchEvent({ ...event });
        });

        it('should pass same object to listeners', () => {
          expect(handlerC).toHaveBeenCalledWith(event);
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
          expect(stack).toEqual([1, 2, 3]);
        });
      });

      describe('When using priorities', () => {
        let stack = null;

        beforeEach(() => {
          stack = [];
          dispatcher.addEventListener('eventA', () => {
            stack.push(3);
          });
          dispatcher.addEventListener(
            'eventA',
            () => {
              stack.push(2);
            },
            1,
          );
          dispatcher.addEventListener(
            'eventA',
            () => {
              stack.push(4);
            },
            -1,
          );
          dispatcher.addEventListener(
            'eventA',
            () => {
              stack.push(1);
            },
            100,
          );
          dispatcher.addEventListener(
            'eventA',
            () => {
              stack.push(5);
            },
            -10000,
          );
          dispatcher.dispatchEvent('eventA');
        });

        it('should keep listeners order when calling', () => {
          expect(stack).toEqual([1, 2, 3, 4, 5]);
        });
      });

      describe('When removing handlers while event is propagated', () => {
        let myHandler;

        beforeEach(() => {
          myHandler = jest.fn(() => {
            dispatcher.removeEventListener('eventA', handlerA);
            dispatcher.removeEventListener('eventA', myHandler);
            dispatcher.removeEventListener('eventA', handlerAA);
            dispatcher.removeEventListener('eventA', handlerA1, 1);
            dispatcher.removeEventListener('eventA', handlerAminus1, -1);
          });

          dispatcher.addEventListener('eventA', handlerA);
          dispatcher.addEventListener('eventA', myHandler);
          dispatcher.addEventListener('eventA', handlerAA);
          dispatcher.addEventListener('eventA', handlerAAA);
          dispatcher.addEventListener('eventA', handlerA1, 1);
          dispatcher.addEventListener('eventA', handlerAminus1, -1);
          dispatcher.dispatchEvent('eventA');
        });

        it('should call only available handlers', () => {
          expect(handlerA).toHaveBeenCalledTimes(1);
          expect(myHandler).toHaveBeenCalledTimes(1);
          expect(handlerA1).toHaveBeenCalledTimes(1);
          expect(handlerAAA).toHaveBeenCalledTimes(1);
          expect(handlerAA).not.toHaveBeenCalled();
          expect(handlerAminus1).not.toHaveBeenCalled();
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
          dispatcher.addEventListener('eventA', handlerAminus1, -1);
          dispatcher.dispatchEvent('eventA');
        });

        it('should stop after processing all listeners of same priority', () => {
          expect(handlerA1).toHaveBeenCalledTimes(1);
          expect(handlerA).toHaveBeenCalledTimes(1);
          expect(handlerAA).toHaveBeenCalledTimes(1);
          expect(handlerAAA).toHaveBeenCalledTimes(1);
          expect(handlerAminus1).not.toHaveBeenCalled();
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
          dispatcher.addEventListener('eventA', handlerAminus1, -1);
          dispatcher.dispatchEvent('eventA');
        });

        it('should stop immediately, dropping all next listeners', () => {
          expect(handlerA1).toHaveBeenCalledTimes(1);
          expect(handlerA).toHaveBeenCalledTimes(1);
          expect(handlerAA).not.toHaveBeenCalled();
          expect(handlerAAA).not.toHaveBeenCalled();
          expect(handlerAminus1).not.toHaveBeenCalled();
        });
      });
    });
  });
});
