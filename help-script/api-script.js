const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function getBearerToken() {
    try {
        const response = await axios({
            method: 'post',
            url: 'https://ims-na1.adobelogin.com/ims/token/v1',
            data: {
                client_id: 'events-milo',
                CLIENT_SECRET: process.env.CLIENT_SECRET,
                grant_type: 'password',
                PASSWORD: process.env.PASSWORD,
                username: 'rea71768+US+Free+VISA+events+1@adobetest.com',
                scope: 'openid,AdobeID'
            }
        });
        return response.data.access_token;
    } catch (error) {
        console.error('Error fetching bearer token:', error.message);
        throw error;
    }
}

// Configuration object for API credentials
const config = {
    bearer: null, // Will be set dynamically
    X_CLIENT_IDENTITY: process.env.X_CLIENT_IDENTITY,
    X_REQUEST_ID: process.env.X_REQUEST_ID
};

async function getAttendees(eventId) {
    try {
        const response = await axios({
            method: 'get',
            url: `https://events-service-platform.adobe.io/v1/events/${eventId}/attendees`,
            headers: {
                'Authorization': `Bearer ${config.bearer}`,
                'x-api-key': 'acom_event_service',
                'x-client-identity': config.X_CLIENT_IDENTITY,
                'x-request-id': config.X_REQUEST_ID
            }
        });
        console.log(`Raw attendee data structure for event ${eventId}:`, {
            totalAttendees: response.data.attendees?.length || 0,
            sampleAttendee: response.data.attendees?.[0] || null,
            hasAttendees: !!response.data.attendees,
            responseKeys: Object.keys(response.data)
        });
        return response.data.attendees || [];
    } catch (error) {
        console.error(`Error fetching attendees for event ${eventId}:`, error.message);
        return [];
    }
}

function createCSV(eventsWithAttendees) {
    const headers = ['GUID', 'Event Name', 'Event Description', 'Event DateTime', 'RSVP Status', 'Checked-In'];
    let csvContent = headers.join(',') + '\n';

    eventsWithAttendees.forEach(event => {
        if (event.attendees && Array.isArray(event.attendees)) {
            event.attendees.forEach(attendee => {
                const row = [
                    `"${attendee.attendeeId || ''}"`,
                    `"${event.eventName}"`,
                    `"${event.description || ''}"`,
                    `"${event.endDate || ''}"`,
                    `"${attendee.registrationStatus || ''}"`,
                    `"${attendee.checkedIn || false}"`
                ];
                csvContent += row.join(',') + '\n';
            });
        }
    });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `event_attendees_${timestamp}.csv`;
    fs.writeFileSync(filename, csvContent);
    console.log(`CSV file created: ${filename}`);
}

async function makeApiCall() {
    try {
        // Fetch bearer token
        config.bearer = await getBearerToken();
        
        const response = await axios({
            method: 'get',
            url: 'https://events-service-platform.adobe.io/v1/events',
            headers: {
                'Authorization': `Bearer ${config.bearer}`,
                'x-api-key': 'acom_event_service',
                'x-client-identity': config.X_CLIENT_IDENTITY,
                'x-request-id': config.X_REQUEST_ID
            }
        });
        
        // Debug logging
        // console.log('Response structure:', Object.keys(response.data));
        // console.log('First few events:', JSON.stringify(response.data.events.slice(0, 2), null, 2));
        
        // Get the events array from the response
        const events = response.data.events || [];
        console.log('Total events received:', events.length);
        
        // Filter for published events
        const publishedEvents = events.filter(event => event && event.published === true);
        // console.log(`Processing first ${publishedEvents.length} published events`);
       
        // Get attendees for each published event
        const eventsWithAttendees = await Promise.all(
            publishedEvents.map(async (event) => {
                const attendees = await getAttendees(event.eventId);
                console.log(`Raw attendee data for event ${event.eventId} (${event.enTitle || event.name}):`, JSON.stringify(attendees, null, 2));
                return {
                    eventId: event.eventId,
                    eventName: event.enTitle || event.name,
                    description: event.localizations && event.localizations['en-US'] ? event.localizations['en-US'].description : '',
                    endDate: event.endDate,
                    attendees: attendees
                };
            })
        );

        // Create CSV file
        createCSV(eventsWithAttendees);
        
        // Check for duplicate attendee IDs
        if (eventsWithAttendees.length > 0) {
            const attendeeIds = eventsWithAttendees[0].attendees.map(a => a.attendeeId);
            const uniqueIds = new Set();
            const duplicateIds = new Set();
            attendeeIds.forEach(id => {
                if (uniqueIds.has(id)) {
                    duplicateIds.add(id);
                } else {
                    uniqueIds.add(id);
                }
            });
            console.log('Total attendee records:', attendeeIds.length);
            console.log('Unique attendee IDs:', uniqueIds.size);
            console.log('Duplicate attendee IDs count:', duplicateIds.size);
            if (duplicateIds.size > 0) {
                console.log('Duplicate attendee IDs:', Array.from(duplicateIds));
            }
        }
        
        //console.log('Events with attendees:', JSON.stringify(eventsWithAttendees, null, 2));
        const totalAttendees = eventsWithAttendees.reduce((sum, event) => sum + event.attendees.length, 0);
        console.log('Total attendees across published events:', totalAttendees);

        eventsWithAttendees.forEach(event => {
            console.log(`Event: ${event.eventName}, Attendees: ${event.attendees.length}`);
        });

        return eventsWithAttendees;
    } catch (error) {
        console.error('Error making API call:', error.message);
        if (error.response) {
            console.error('Error response data:', error.response.data);
            console.error('Error response status:', error.response.status);
        }
        throw error;
    }
}

// Execute the API call
makeApiCall();