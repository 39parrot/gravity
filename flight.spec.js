var Flight = require('./config.js').Flight;
var moment = require('moment');

beforeEach(function () {
    var matchers = {
        equalsFlight: function (flight) {
            var actual = this.actual;
            return ((actual.flight_number === flight.flight_number) && !(flight.departure_datetime === undefined) &&
            (actual.departure_datetime === flight.departure_datetime) && !(flight.arrival_datetime === undefined) &&
            actual.arrival_datetime === flight.arrival_datetime)
        }
    };

    this.addMatchers(matchers);
});


describe("Flight module ", function () {

    it("responds to ...", function () {
        expect(Flight.create).not.toBeUndefined();
        expect(Flight.find).not.toBeUndefined();
        expect(Flight.delete).not.toBeUndefined();
        expect(Flight.q).not.toBeUndefined();
        expect(Object.keys(Flight).length).toBe(4);

        expect(Flight.q.create).not.toBeUndefined();
        expect(Flight.q.find).not.toBeUndefined();
        expect(Flight.q.delete).not.toBeUndefined();
        expect(Object.keys(Flight.q).length).toBe(3);
    });
});

describe("Flight:", function () {

    it("create + retrieve", function () {
        var f1 = Flight.create();
        var f2 = Flight.find(f1);
        expect(f2.flight_number).toBe(f1.flight_number);
        expect(f2.departure_datetime).not.toBeUndefined();
        expect(f2.departure_datetime).toBe(f1.departure_datetime);
        expect(f2.arrival_datetime).not.toBeUndefined();
        expect(f2.arrival_datetime).toBe(f1.arrival_datetime);

        expect(f2).equalsFlight(f1);

        // POST
        Flight.delete(f1);
    });

    //FlightIdentity
    //{
    //    flight_number: 'BLX001',
    //    departure_date: '2015-01-29'
    //}

    //Flight
    //{
    //    flight_number: 'BLX001',
    //    departure_datetime: '2015-01-29 17:05',
    //    departure_airport: 'ARN',
    //    arrival_datetime: '2015-01-29 19:05',
    //    arrival_airport: 'SVO'
    //
    //    identity: function() { return <FlightIdentity>}
    //}

    it("Flight methods return JSON responding to ...", function () {
        // PRE - make sure at least 1 flight is in the db
        var tmp = Flight.create();

        var f = Flight.find();
        // expecting f to be "correct"
        expect(f.flight_number).not.toBeUndefined();
        expect(f.departure_datetime).not.toBeUndefined();
        expect(f.departure_airport).not.toBeUndefined();
        expect(f.departure_airport).toMatch(/^[A-Z]{3}$/);
        expect(f.arrival_datetime).not.toBeUndefined();
        expect(f.arrival_airport).not.toBeUndefined();
        expect(f.arrival_airport).toMatch(/^[A-Z]{3}$/);
        expect(f.identity()).not.toBeUndefined();
        expect(f._error).not.toBeUndefined();
        expect(Object.keys(f).length).toBe(7);

        // POST
        Flight.delete(tmp);
    });

    it(".identity()", function () {
        // PRE - make sure at least 1 flight is in the db
        var tmp = Flight.create();

        var flightId = Flight.find().identity();
        // expecting flight's identity to be "correct"
        expect(flightId.flight_number).not.toBeUndefined();
        expect(flightId.departure_date).not.toBeUndefined();
        // TODO: expect flightId.departure_date to match ISO date format: YYYY-MM-DD
        expect(Object.keys(flightId).length).toBe(2);

        var f = Flight.create();
        flightId = f.identity();
        // expecting flight's identity to be "correct"
        expect(flightId.flight_number).not.toBeUndefined();
        expect(flightId.flight_number).toBe(f.flight_number);
        expect(flightId.departure_date).not.toBeUndefined();
        expect(flightId.departure_date).toBe(moment(f.departure_datetime).format('YYYY-MM-DD'));
        // TODO: expect flightId.departure_date to match ISO date format: YYYY-MM-DD
        expect(Object.keys(flightId).length).toBe(2);

        // POST
        Flight.delete(tmp);
        Flight.delete(f);
    });
});

describe("Flight create", function () {

    it("flight already exists", function () {
        var f1 = Flight.create({flight_number: 'BLX001', departure_datetime: '2015-02-02T16:15:00Z'});
        expect(f1._error.code).toBeUndefined();
        var f2 = Flight.create({flight_number: 'BLX001', departure_datetime: '2015-02-02T16:15:00Z'});
        expect(f2._error.code).toBe('DUPLICATE_FLIGHT');

        // POST
        Flight.delete({flight_number: 'BLX001', departure_datetime: '2015-02-02T16:15:00Z'});
    });

    it("flight already exists even if time is different but date same", function () {
        var f1 = Flight.create({flight_number: 'BLX001', departure_datetime: '2015-02-02T16:15:00Z'});
        expect(f1._error.code).toBeUndefined();
        var f2 = Flight.create({flight_number: 'BLX001', departure_datetime: '2015-02-02T11:00:00Z'});
        expect(f2._error.code).toBe('DUPLICATE_FLIGHT');

        // POST
        Flight.delete(f1);
    });

    it("different alternatives", function () {
        var f;

        // OK - flight number and date and time get randomly generated
        f = Flight.create();
        expect(f._error.code).toBeUndefined();
        // TODO: expect amount of flights to increase by 1
        Flight.delete(f);

        // Not OK - missing date and time
        f = Flight.create({flight_number: 'BLX002'});
        expect(f._error.code).toBe('FLIGHT_IDENTITY_NOT_COMPLETE');
        // TODO: expect amount of flights not to change

        // Not OK - can't create a flight without time
        f = Flight.create({flight_number: 'BLX003', departure_date: 'whatever'});
        expect(f._error.code).not.toBeUndefined(); // TODO: expect an error code
        // TODO: expect amount of flights not to change

        // OK
        f = Flight.create({flight_number: 'BLX004', departure_datetime: '2015-01-30T00:00:00+01:00'});
        expect(f._error.code).toBeUndefined();
        // TODO: expect amount of flights to increase by 1
        Flight.delete(f);

        // Not OK - invalid date
        f = Flight.create({flight_number: 'BLX006', departure_datetime: '2374564438'});
        expect(f._error.code).not.toBeUndefined(); // TODO: expect an error code
        // TODO: expect amount of flights not to change

        // OK - flight number gets randomly generated
        f = Flight.create({departure_datetime: '29 Jan 2015 13:15'});
        expect(f._error.code).toBeUndefined();
        // TODO: expect amount of flights to increase by 1
        Flight.delete(f);
    });
});


//Flight
//.create()
//.create( { flight_number: ?, departure_date: ? } )
//.create( { flight_number: ?, departure_datetime: ? } )
//.create()

describe("Flight find", function () {

    it("", function () {
        var f = Flight.find({flight_number: 'XXX999'});
        expect(f._error.code).toBe('FLIGHT_IDENTITY_NOT_COMPLETE');
    });
});

//Flight
//.find()
//.find( { flight_number: ? } )
//.find( { departure_date: ? } )
//.find( { flight_number: ? , departure_date: ? }

describe("Flight delete", function () {
    it("", function () {
        var f = Flight.create();
        expect(f).not.toBeUndefined();
        Flight.delete(f);
        var f2 = Flight.find(f);
        expect(f2._error.code).toBe('FLIGHT_FIND_FLIGHT_NOT_FOUND');
    });

    it("", function () {
        // Not OK
        var result;
        result = Flight.delete({flight_number: 'ABC123'});
        expect(result._error.code).toBe('FLIGHT_IDENTITY_NOT_COMPLETE');

        // Not OK
        result = Flight.delete({departure_date: 'ABC123'});
        expect(result._error.code).toBe('FLIGHT_IDENTITY_NOT_COMPLETE');

        // Not OK
        result = Flight.delete({departure_datetime: 'ABC123'});
        expect(result._error.code).toBe('FLIGHT_IDENTITY_NOT_COMPLETE');

        var f;
        // OK
        f = Flight.create();
        result = Flight.delete({flight_number: f.flight_number, departure_date: f.identity().departure_date});
        //result = Flight.delete({flight_number: f.flight_number, departure_date: f.departure_date});
        expect(result._error.code).toBeUndefined();

        // OK
        f = Flight.create();
        result = Flight.delete({flight_number: f.flight_number, departure_datetime: f.departure_datetime});
        expect(result._error.code).toBeUndefined();
    });
});

//Flight
//.delete( { flight_number: ?, departure_date: ? } )
//.delete( { flight_number: ?, departure_datetime: ? } )