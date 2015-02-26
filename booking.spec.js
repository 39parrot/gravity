var Flight = require('./config').Flight;
var Booking = require('./config').Booking;

describe("booking:", function () {

    it("creating a flight + creating a booking and retrieving the booking", function () {
        // WHEN
        //  creating a random flight
        var f = Flight.create();
        //console.log(f);
        // THEN
        // TODO: how about doing expectations for the flight here?

        // WHEN
        //  creating a booking for this flight
        var b1 = Booking.create(
            {
                booking_number: 'ASDYFASDF',
                flights: [
                    {
                        flight_number: f.flight_number,
                        //departure_date: f.departure_date() // TODO: Flight.departure_date() does not exist yet. Flight don't have departure_date()
                        departure_datetime: f.departure_datetime
                    }
                ]
            }
        );
        //console.log(b1);

        // THEN
        //  expect booking to be created
        expect(b1).not.toBeNull();
        expect(b1.booking_number).toBe('ASDYFASDF');
        expect(b1.flights.length).toBe(1);
        expect(b1.flights[0].flight_number).toBe(f.flight_number);
        //expect(b1.flights[0].departure_date).toBe(f.departure_date());
        expect(b1.flights[0].departure_datetime).toBe(f.departure_datetime);

        // WHEN
        //  retrieving newly created booking by booking_number
        var b2 = {
            booking_number: 'ASDYFASDF'
        };
        var b3 = Booking.find(b2);
        //console.log(b3);

        // THEN
        //  expect same booking to be retrieved
        expect(b3).not.toBeNull();
        expect(b3.booking_number).toBe('ASDYFASDF');
        expect(b3.flights.length).toBe(1);
        expect(b3.flights[0].flight_number).toBe(f.flight_number);
        expect(b3.flights[0].departure_datetime).toBe(f.departure_datetime);
        expect(b3.passengers.length).toBe(1);
        expect(b3.passengers[0].first_name).not.toBeNull();

        //  expect the booking not to have other properties
        // TODO:
    });

    it("booking_number gets generated when missing", function () {
        // GIVEN
        //  a flight
        var f = Flight.create();
        //console.log(f);

        // WHEN
        //  creating a booking, booking_number missing
        var b1 = Booking.create(
            {
                flights: [
                    {
                        flight_number: f.flight_number,
                        departure_datetime: f.departure_datetime
                    }
                ]
            }
        );


        // THEN
        //  expect booking to be created
        expect(b1).not.toBeNull();
        expect(b1.booking_number).not.toBeNull();
    });

    it("Find booking with departure date", function () {
        var f = Flight.create();
        var f2 = Flight.create();

        var b = Booking.create({
            flights: [
                {
                    flight_number: f.flight_number,
                    departure_datetime: f.departure_datetime
                },
                {
                    flight_number: f2.flight_number,
                    departure_datetime: f2.departure_datetime
                }
            ],
            passengers: [
                {firstName: 'Dmitry', lastName: 'Kouznetsov'},
                {firstName: 'Ivan', lastName: 'Ivanov'},
                {firstName: 'Petr', lastName: 'Petrov'}
            ]
        });

        var b2 = Booking.find({booking_number: b.booking_number, departure_datetime: f.departure_datetime});

        expect(b2).not.toBeNull();

        expect(true).toBe(function (flights, departure_datetime) {
            for (var i = 0; i < flights.length; i++) {
                if (flights[i].departure_datetime.getTime() === departure_datetime.getTime()) {
                    return true;
                }
                return false;
            }
        }(b2.flights, f.departure_datetime));

        Flight.delete(f);
        Flight.delete(f2);
        Booking.delete(b2);
    });

    it("Booking.toCM2 returns not null result", function () {
        var f = Flight.create();

        var b = Booking.create({
            flights: [
                {
                    flight_number: f.flight_number,
                    departure_datetime: f.departure_datetime
                }
            ]
        });

        //TODO find return more datas than Booking.create()
        var b2 = Booking.find({booking_number: b.booking_number, departure_datetime: f.departure_datetime});
        var cm2 = Booking.toCM2([b2]);

        expect(cm2).not.toBeUndefined();
        expect(cm2).not.toBeNull();

        Flight.delete(f);
        Booking.delete(b2);
    })
});