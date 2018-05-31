/**
 * Created by Oleg Galaburda on 15.02.16.
 */

import EventDispatcher, { Event } from '../EventDispatcher';

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
});
