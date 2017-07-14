/**
 * Created by Oleg Galaburda on 15.02.16.
 */

import EventDispatcher, { Event } from './EventDispatcher';

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
    expect(event.type).to.be.equal(type);
  });
  it('should have data', () => {
    expect(event.data).to.be.equal(data);
  });

  describe('preventDefault()', () => {
    it('should not be prevented from init', () => {
      expect(event.isDefaultPrevented()).to.be.false;
    });

    describe('When called', () => {
      beforeEach(() => {
        event.preventDefault();
      });
      it('should become prevented', () => {
        expect(event.isDefaultPrevented()).to.be.true;
      });
    });
  });

  describe('toJSON()', () => {
    it('should include only type and data', () => {
      expect(event.toJSON()).to.be.eql({
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
        expect(eventObject.stopPropagation).to.be.an.instanceof(Function);
      });
      dispatcher.dispatchEvent(eventObject);
      expect(eventObject.stopPropagation).to.be.undefined;
    });
    it('should have stopImmediatePropagation()', () => {
      dispatcher.addEventListener(eventObject.type, () => {
        expect(eventObject.stopImmediatePropagation).to.be.an.instanceof(Function);
      });
      dispatcher.dispatchEvent(eventObject);
      expect(eventObject.stopImmediatePropagation).to.be.undefined;
    });
  });

});
