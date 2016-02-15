/**
 * Created by Oleg Galaburda on 15.02.16.
 */
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
