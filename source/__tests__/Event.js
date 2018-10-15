/**
 * Created by Oleg Galaburda on 15.02.16.
 */

import { EventDispatcher, Event, getEvent } from '../index';

describe('Event', () => {
  let event = '';
  let data = '';
  let type = '';

  beforeEach(() => {
    data = { value: false };
    type = 'someEventType';
    event = new Event(type, data);
  });

  it('should have type', () => {
    expect(event.type).toBe(type);
  });

  it('should have data', () => {
    expect(event.data).toBe(data);
  });

  describe('preventDefault()', () => {
    it('should not be prevented from init', () => {
      expect(event.isDefaultPrevented()).toBe(false);
    });

    describe('When called', () => {
      beforeEach(() => {
        event.preventDefault();
      });

      it('should become prevented', () => {
        expect(event.isDefaultPrevented()).toBe(true);
      });
    });
  });

  describe('toJSON()', () => {
    it('should include only type and data', () => {
      expect(event.toJSON()).toEqual({
        data: { value: false },
        type: 'someEventType',
      });
    });
  });

  describe('When dispatched', () => {
    let dispatcher;
    let eventObject;
    beforeEach(() => {
      dispatcher = new EventDispatcher();
      eventObject = new Event('anyEvent');
    });

    it('should have stopPropagation()', () => {
      dispatcher.addEventListener(eventObject.type, () => {
        expect(eventObject.stopPropagation).toBeInstanceOf(Function);
      });

      dispatcher.dispatchEvent(eventObject);
      expect(eventObject.stopPropagation).toBeUndefined();
    });

    it('should have stopImmediatePropagation()', () => {
      dispatcher.addEventListener(eventObject.type, () => {
        expect(eventObject.stopImmediatePropagation).toBeInstanceOf(Function);
      });

      dispatcher.dispatchEvent(eventObject);
      expect(eventObject.stopImmediatePropagation).toBeUndefined();
    });
  });

  describe('getEvent()', () => {
    describe('When event type passed', () => {
      beforeEach(() => {
        event = getEvent('event-type');
      });

      it('should store event type', () => {
        expect(event.type).toBe('event-type');
      });

      it('data should be null', () => {
        expect(event.data).toBeNull();
      });
    });

    describe('When event type with data passed', () => {
      beforeEach(() => {
        event = getEvent('event-type', 'some data');
      });

      it('data store passed value', () => {
        expect(event.data).toBe('some data');
      });
    });

    describe("When event type is'n a string", () => {
      beforeEach(() => {
        event = getEvent(256);
      });

      it('should create event object with number-string as type', () => {
        expect(event.type).toBe('256');
      });
    });

    describe('When event object passed', () => {
      beforeEach(() => {
        event = getEvent({
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
      beforeEach(() => {
        event = getEvent(
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
});
