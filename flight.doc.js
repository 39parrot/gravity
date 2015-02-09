// Flight.create
// WARNING! datetime - there should always be time in the value, no time - error
// WARNING! date - time is always ignored
Flight.create(); // creates a flight with random flight_number and random departure_datetime // TODO: time should be with "round" minutes and 00 seconds
Flight.create({flight_number: 'BLX002'}); // Not OK - missing timestamp; returns { _error: { code: 'FLIGHT_IDENTITY_NOT_COMPLETE' } }
Flight.create({flight_number: 'BLX004', departure_datetime: '2015-01-30T00:00:00+01:00'}); // timestamp is an instant
Flight.create({flight_number: 'BLX004', departure_datetime: '2015-01-30T00:00:00Z'}); // timestamp is an instant
Flight.create({flight_number: 'BLX004', departure_datetime: '2015-01-30T00:00:00'}); // timestamp reads as airport local time
Flight.create({flight_number: 'BLX004', departure_datetime: '2015-01-30'}); // Not OK - missing time
Flight.create({flight_number: 'BLX104', departure_datetime: '9 Feb 2015'}); // Not OK - missing time // TODO: maybe it's ok since it's datetime
Flight.create({flight_number: 'BLX104', departure_datetime: '9 Feb 2015 12:00'}); // timestamp reads as airport local time
Flight.create({flight_number: 'BLX005', departure_datetime: 'asdlfhdsaf'}); // Not OK - invalid timestamp
Flight.create({departure_date: '2015-01-29'}); // Not OK - missing time
Flight.create({departure_datetime: '2015-01-29 10:00'});

// flight.find
