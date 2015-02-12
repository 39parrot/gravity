var Flight = require('./config').Flight;
var Booking = require('./config').Booking;

// TODO: what the heck is this?
process.setMaxListeners(0);


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


    it("Adding some flights to booking", function () {
        console.log('Adding some flights to booking')
        // GIVEN
        // Some flights
        var f1 = Flight.create();
        var f2 = Flight.create();
        var f3 = Flight.create();

        // WHEN
        var b = Booking.create(
            {
                flights: [
                    {
                        flight_number: f1.flight_number,
                        departure_datetime: f1.departure_datetime
                    }, {
                        flight_number: f2.flight_number,
                        departure_datetime: f2.departure_datetime
                    }, {
                        flight_number: f3.flight_number,
                        departure_datetime: f3.departure_datetime
                    }
                ]
            }
        );

        console.log(b.booking_number);
        console.log(b);

        //THEN
        expect(b.flights.length).toBe(3);
    });

    it("Adding some passengers to booking", function () {
        // GIVEN
        // Some flights
        var f1 = Flight.create();

        //WHEN
        var b = Booking.create(
            {
                flights: [{flight_number: f1.flight_number, departure_datetime: f1.departure_datetime}],
                passengers: [{firstName: 'Dmitry', lastName: 'Kouznetsov'}, {firstName: 'Ivan', lastName: 'Ivanov'},
                    {firstName: 'Petr', lastName: 'Petrov'}
                ]
            });

        console.log(b.booking_number);
        expect(b.passengers.length).toBe(3)
    });

    it("Adding some passengers and some flights to booking", function () {
        // GIVEN
        // Some flights
        var f1 = Flight.create();
        var f2 = Flight.create();

        //WHEN
        var b = Booking.create(
            {
                flights: [{flight_number: f1.flight_number, departure_datetime: f1.departure_datetime},
                    {flight_number: f2.flight_number, departure_datetime: f2.departure_datetime}],
                passengers: [{firstName: 'Dmitry', lastName: 'Kouznetsov'}, {firstName: 'Ivan', lastName: 'Ivanov'},
                    {firstName: 'Petr', lastName: 'Petrov'}
                ]
            });

        console.log(b.booking_number);
        expect(b.flights.length).toBe(2);
        expect(b.passengers.length).toBe(3);
    });
});

