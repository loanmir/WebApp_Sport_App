db = db.getSiblingDB('sports_db');

db.createCollection('users');
db.createCollection('tournaments');
db.createCollection('teams');
db.createCollection('fields');
db.createCollection('bookings');
db.createCollection('matches');



// INSERTING INTO USERS
db.users.insertMany([
  {
    "_id": ObjectId("6964ef83ab6e32b48057c284"),
    "user_username": "admin",
    "user_password": "adminpassword",
    "user_firstName": "System",
    "user_surname": "Administrator"
  },
  {
    "_id": ObjectId("6964ef83ab6e32b48057c285"),
    "user_username": "mario.rossi",
    "user_password": "password123",
    "user_firstName": "Mario",
    "user_surname": "Rossi"
  },
  {
    "_id": ObjectId("6964ef83ab6e32b48057c286"),
    "user_username": "luca.sport",
    "user_password": "securePass1!",
    "user_firstName": "Luca",
    "user_surname": "Bianchi"
  },
  {
    "_id": ObjectId("6964ef83ab6e32b48057c287"),
    "user_username": "giulia2024",
    "user_password": "mysecretpassword",
    "user_firstName": "Giulia",
    "user_surname": "Verdi"
  },
  {
    "_id": ObjectId("6964ef83ab6e32b48057c288"),
    "user_username": "coach_john",
    "user_password": "coachlogin",
    "user_firstName": "John",
    "user_surname": "Doe"
  },
  {
    "_id": ObjectId("69666b478430ca0ecbfda534"),
    "user_username": "darione",
    "user_password": "1234",
    "user_firstName": "Dario",
    "user_surname": "Cernic"
  },
  {
    "_id": ObjectId("69666c8e84b520f408154658"),
    "user_username": "jack",
    "user_password": "789",
    "user_firstName": "Alejandro",
    "user_surname": "Ramirez"
  },
  {
    "_id": ObjectId("696b537ec542830737c83f32"),
    "user_username": "doccia",
    "user_password": "rimasto",
    "user_firstName": "doccia",
    "user_surname": "persi"
  },
  {
    "_id": ObjectId("6974c76f10bfba766de5f2f0"),
    "user_username": "pippoBaudo",
    "user_password": "pippo",
    "user_firstName": "Pippo",
    "user_surname": "Baudo"
  },
  {
    "_id": ObjectId("69774b51e5c32f40856e1558"),
    "user_username": "loanmir",
    "user_password": "r6ranked",
    "user_firstName": "Giorgio",
    "user_surname": "Rovati"
  },
  {
    "_id": ObjectId("697a225e4633ebac9fce89e1"),
    "user_username": "Johann_xd",
    "user_password": "4567",
    "user_firstName": "Johann",
    "user_surname": "Todt"
  }
]);

print("***** Users seeded successfully! *****");


// INSERTING INTO TEAMS
db.teams.insertMany([
  {
    "_id": ObjectId("6974a92c4fe693fd19390b38"),
    "name": "Net Blockers",
    "creator": ObjectId("69666b478430ca0ecbfda534"), // Linked to 'darione'
    "tournament": ObjectId("6974a8784fe693fd19390b2e"),
    "players": [
        { "name": "Simone", "surname": "Giannelli", "number": 6 },
        { "name": "Massimo", "surname": "Colaci", "number": 13 }
    ]
  },
  {
    "_id": ObjectId("6974a92c4fe693fd19390b39"),
    "name": "Ace Strikers",
    "creator": ObjectId("69666b478430ca0ecbfda534"), // Linked to 'darione'
    "tournament": ObjectId("6974a8784fe693fd19390b2e"),
    "players": [
        { "name": "Earvin", "surname": "Ngapeth", "number": 9 },
        { "name": "Bruno", "surname": "Rezende", "number": 1 },
        { "name": "Eric", "surname": "Dal Pino", "number": 11 }
    ]
  },
  {
    "_id": ObjectId("6974a92c4fe693fd19390b3a"),
    "name": "Dunk Masters",
    "creator": ObjectId("6964ef83ab6e32b48057c284"), // Linked to 'admin'
    "tournament": ObjectId("697b2b9b7edfd4b8d8da549b"),
    "players": [
        { "name": "Stephen", "surname": "Curry", "number": 30 },
        { "name": "Klay", "surname": "Thompson", "number": 11 }
    ]
  },
  {
    "_id": ObjectId("6974a92c4fe693fd19390b3b"),
    "name": "Rim Protectors",
    "creator": ObjectId("6964ef83ab6e32b48057c284"), // Linked to 'admin'
    "tournament": ObjectId("697b2b9b7edfd4b8d8da549b"),
    "players": [
        { "name": "Rudy", "surname": "Gobert", "number": 27 },
        { "name": "Victor", "surname": "Wembanyama", "number": 1 }
    ]
  },
  {
    "_id": ObjectId("6974a92c4fe693fd19390b3c"),
    "name": "Real Madrid 5v5",
    "creator": ObjectId("6964ef83ab6e32b48057c287"), // Linked to 'giulia2024'
    "tournament": ObjectId("697b2b9b7edfd4b8d8da549b"),
    "players": [
        { "name": "Vinicius", "surname": "Jr", "number": 7 },
        { "name": "Luka", "surname": "Modric", "number": 10 }
    ]
  },
  {
    "_id": ObjectId("6974a92c4fe693fd19390b3d"),
    "name": "Barca Legends",
    "creator": ObjectId("6964ef83ab6e32b48057c287"), // Linked to 'giulia2024'
    "tournament": ObjectId("697b2b9b7edfd4b8d8da549b"),
    "players": [
        { "name": "Lionel", "surname": "Messi", "number": 10 },
        { "name": "Andres", "surname": "Iniesta", "number": 8 }
    ]
  },
  {
    "_id": ObjectId("6974a92c4fe693fd19390b40"),
    "name": "Udine United",
    "creator": ObjectId("6964ef83ab6e32b48057c285"), // Linked to 'mario.rossi'
    "tournament": null, // Free Agent
    "players": [
        { "name": "Antonio", "surname": "Di Natale", "number": 10 },
        { "name": "Alessandro", "surname": "Del Piero", "number": 10 }
    ]
  },
  {
    "_id": ObjectId("6974a92c4fe693fd19390b41"),
    "name": "Beach Boys Volley",
    "creator": ObjectId("6964ef83ab6e32b48057c285"), // Linked to 'mario.rossi'
    "tournament": null,
    "players": [
        { "name": "Anders", "surname": "Mol", "number": 1 },
        { "name": "Christian", "surname": "Sørum", "number": 2 }
    ]
  },
  {
    "_id": ObjectId("6974aa5ea8511a16433d9e96"),
    "name": "High Jumpers",
    "creator": ObjectId("69666b478430ca0ecbfda534"), // Linked to 'darione'
    "tournament": null,
    "players": [
        { "name": "Dario", "surname": "Jak", "number": 3 },
        { "name": "Kobe", "surname": "Bryant", "number": 33 },
        { "name": "Victor", "surname": "Faggiani", "number": 77 }
    ]
  },
  {
    "_id": ObjectId("697a2878329e756bf83a3871"),
    "name": "German Shepherds",
    "creator": ObjectId("697a225e4633ebac9fce89e1"), // Linked to 'Johann'
    "tournament": null,
    "players": [
        { "name": "Giorgia", "surname": "Giannini", "number": 12 },
        { "name": "Angelica", "surname": "Iachetti", "number": 14 },
        { "name": "Sara", "surname": "Beltrame", "number": 8 }
    ]
  }
]);

print("***** Teams seeded successfully! *****");




// INSERTING INTO TOURNAMENTS
db.tournaments.insertMany([
  {
    "_id": ObjectId("6974a8784fe693fd19390b2e"),
    "name": "Summer Volley Cup 2026",
    "sport": "Volleyball",
    "creator": "6964ef83ab6e32b48057c284", 
    "maxTeams": 8,
    "currentTeams": 0,
    "status": "Open",
    "startDate": "2026-06-15T09:00:00.000Z"
  },
  {
    "_id": ObjectId("697b2b9b7edfd4b8d8da549b"),
    "name": "Testing Tournament 1",
    "sport": "Football",
    "startDate": "2026-01-30T00:00:00.000+00:00",
    "maxTeams": 6,
    "creator": ObjectId("697a225e4633ebac9fce89e1"), 
    "status": "Active",
    "__v": 0
  }
]);

print("***** Tournaments seeded successfully! *****");




// INSERTING INTO FIELDS
db.fields.insertMany([
  {
    "_id": ObjectId("696b5ad174938df6ca5ad575"),
    "name": "Central City Stadium",
    "sport": "Football",
    "address": "Via Roma 10, Milano",
    "bookableSlots": [
        { "id": 1, "time": "18:00-19:00" },
        { "id": 2, "time": "19:00-20:00" },
        { "id": 3, "time": "20:00-21:00" },
        { "id": 4, "time": "21:00-22:00" }
    ]
  },
  {
    "_id": ObjectId("696b5ad174938df6ca5ad576"),
    "name": "Downtown Hoops",
    "sport": "Basketball",
    "address": "Piazza Vittoria 12, Rome",
    "bookableSlots": [
        { "id": 1, "time": "16:00-17:00" },
        { "id": 2, "time": "17:00-18:00" },
        { "id": 3, "time": "18:00-19:00" }
    ]
  },
  {
    "_id": ObjectId("696b5ad174938df6ca5ad577"),
    "name": "Sunny Beach Volley",
    "sport": "Volleyball",
    "address": "Lungomare 5, Rimini",
    "bookableSlots": [
        { "id": 1, "time": "10:00-11:00" },
        { "id": 2, "time": "11:00-12:00" },
        { "id": 3, "time": "15:00-16:00" },
        { "id": 4, "time": "16:00-17:00" }
    ]
  },
  {
    "_id": ObjectId("696b5ad174938df6ca5ad578"),
    "name": "Northside Pitch",
    "sport": "Football",
    "address": "Via Garibaldi 88, Turin",
    "bookableSlots": [
        { "id": 1, "time": "17:00-18:00" },
        { "id": 2, "time": "18:00-19:00" },
        { "id": 3, "time": "19:00-20:00" },
        { "id": 4, "time": "20:00-21:00" },
        { "id": 5, "time": "21:00-22:00" }
    ]
  },
  {
    "_id": ObjectId("696b5ad174938df6ca5ad579"),
    "name": "Community Gym",
    "sport": "Basketball",
    "address": "Corso Umberto 22, Naples",
    "bookableSlots": [
        { "id": 1, "time": "18:00-19:00" },
        { "id": 2, "time": "19:00-20:00" },
        { "id": 3, "time": "20:00-21:00" }
    ]
  },
  {
    "_id": ObjectId("696b5ad174938df6ca5ad57a"),
    "name": "Indoor Arena",
    "sport": "Volleyball",
    "address": "Via Dante 4, Florence",
    "bookableSlots": [
        { "id": 1, "time": "18:00-19:00" },
        { "id": 2, "time": "19:00-20:00" },
        { "id": 3, "time": "20:00-21:00" }
    ]
  },
  {
    "_id": ObjectId("696b5ad174938df6ca5ad57b"),
    "name": "Red Grass Field",
    "sport": "Football",
    "address": "Via Verdi 9, Bologna",
    "bookableSlots": [
        { "id": 1, "time": "09:00-10:00" },
        { "id": 2, "time": "10:00-11:00" }
    ]
  },
  {
    "_id": ObjectId("696b5ad174938df6ca5ad57c"),
    "name": "Streetball Park",
    "sport": "Basketball",
    "address": "Via Mazzini 3, Venice",
    "bookableSlots": [
        { "id": 1, "time": "14:00-15:00" },
        { "id": 2, "time": "15:00-16:00" },
        { "id": 3, "time": "16:00-17:00" },
        { "id": 4, "time": "17:00-18:00" }
    ]
  },
  {
    "_id": ObjectId("696b5ad174938df6ca5ad57d"),
    "name": "Sand Court 2",
    "sport": "Volleyball",
    "address": "Lido di Ostia, Rome",
    "bookableSlots": [
        { "id": 1, "time": "09:00-10:00" },
        { "id": 2, "time": "10:00-11:00" },
        { "id": 3, "time": "11:00-12:00" }
    ]
  },
  {
    "_id": ObjectId("696b5ad174938df6ca5ad57e"),
    "name": "Champions Ground",
    "sport": "Football",
    "address": "Via Sempione 100, Milan",
    "bookableSlots": [
        { "id": 1, "time": "18:00-19:00" },
        { "id": 2, "time": "19:00-20:00" },
        { "id": 3, "time": "20:00-21:00" },
        { "id": 4, "time": "21:00-22:00" }
    ]
  },
  {
    "_id": ObjectId("6974b328278d0ae12258cd41"),
    "name": "Campetto San't Anna",
    "sport": "Football",
    "address": "Via Brigata Casale, 23",
    "bookableSlots": [
        { "id": 1, "time": "08:00-09:00" }, { "id": 2, "time": "09:00-10:00" }, 
        { "id": 3, "time": "10:00-11:00" }, { "id": 4, "time": "11:00-12:00" },
        { "id": 5, "time": "14:00-15:00" }, { "id": 6, "time": "15:00-16:00" },
        { "id": 7, "time": "16:00-17:00" }, { "id": 8, "time": "17:00-18:00" },
        { "id": 9, "time": "18:00-19:00" }, { "id": 10, "time": "19:00-20:00" },
        { "id": 11, "time": "20:00-21:00" }, { "id": 12, "time": "21:00-22:00" }
    ]
  },
  {
    "_id": ObjectId("6974b356278d0ae12258cdaf"),
    "name": "PalaBigot",
    "sport": "Basketball",
    "address": "Via Roma, 4",
    "bookableSlots": [
        { "id": 1, "time": "09:00-11:00" },
        { "id": 2, "time": "13:00-15:00" }
    ]
  },
  {
    "_id": ObjectId("697a27dc329e756bf83a341d"),
    "name": "Berlin Elite Garden",
    "sport": "Basketball",
    "address": "Hersmannsen Street 34",
    "bookableSlots": [
        { "id": 1, "time": "18:20-19:20" },
        { "id": 2, "time": "20:00-22:00" }
    ]
  }
]);

print("***** Fields seeded successfully! *****");




// INSERTING INTO BOOKINGS
db.bookings.insertMany([
  {
    "_id": ObjectId("696b7573e25099eca2294ea1"),
    "field": ObjectId("696b5ad174938df6ca5ad577"),
    "user": ObjectId("6964ef83ab6e32b48057c287"), // User 'giulia2024'
    "date": new Date("2026-01-18T00:00:00.000Z"),
    "timeSlot": "11:00-12:00",
    "createdAt": new Date("2026-01-17T11:41:39.448Z"),
    "__v": 0
  },
  {
    "_id": ObjectId("696cbd3dc6db73851558d736"),
    "field": ObjectId("696b5ad174938df6ca5ad575"),
    "user": ObjectId("6964ef83ab6e32b48057c284"), // User 'admin'
    "date": new Date("2026-02-23T00:00:00.000Z"),
    "timeSlot": "20:00-21:00",
    "createdAt": new Date("2026-01-18T11:00:13.336Z"),
    "__v": 0
  },
  {
    "_id": ObjectId("696cbd71c6db73851558d7f9"),
    "field": ObjectId("696b5ad174938df6ca5ad57a"),
    "user": ObjectId("6964ef83ab6e32b48057c287"), // User 'giulia2024'
    "date": new Date("2026-01-29T00:00:00.000Z"),
    "timeSlot": "18:00-19:00",
    "createdAt": new Date("2026-01-18T11:01:05.236Z"),
    "__v": 0
  },
  {
    "_id": ObjectId("696e4e7e011ef2bdfd4297cf"),
    "field": ObjectId("696b5ad174938df6ca5ad579"),
    "user": ObjectId("6964ef83ab6e32b48057c284"), // User 'admin'
    "date": new Date("2026-03-13T00:00:00.000Z"),
    "timeSlot": "18:00-19:00",
    "createdAt": new Date("2026-01-19T15:32:14.830Z"),
    "__v": 0
  },
  {
    "_id": ObjectId("6974c00e365111dceabf0690"),
    "field": ObjectId("6974b356278d0ae12258cdaf"),
    "user": ObjectId("69666b478430ca0ecbfda534"), // 'darione'
    "date": new Date("2026-01-30T00:00:00.000Z"),
    "timeSlot": "09:00-11:00",
    "createdAt": new Date("2026-01-24T12:50:22.412Z"),
    "__v": 0
  }
]);

print("***** Bookings seeded successfully! *****");


// INSERTING INTO MATCHES
db.matches.insertMany([
  {
    "_id": ObjectId("697b2ba77edfd4b8d8da54f3"),
    "tournament": ObjectId("697b2b9b7edfd4b8d8da549b"), // Testing Tournament 1
    "teamA": ObjectId("6974a92c4fe693fd19390b3a"),      // Dunk Masters
    "teamB": ObjectId("6974a92c4fe693fd19390b3d"),      // Barca Legends
    "scoreA": 0,
    "scoreB": 0,
    "date": new Date("2026-01-30T14:00:00.000Z"),
    "played": false,
    "round": 1,
    "field": null
  },
  {
    "_id": ObjectId("697b2ba77edfd4b8d8da54f4"),
    "tournament": ObjectId("697b2b9b7edfd4b8d8da549b"),
    "teamA": ObjectId("6974a92c4fe693fd19390b3b"),      // Rim Protectors
    "teamB": ObjectId("6974a92c4fe693fd19390b3c"),      // Real Madrid 5v5
    "scoreA": 0,
    "scoreB": 0,
    "date": new Date("2026-01-30T14:00:00.000Z"),
    "played": false,
    "round": 1,
    "field": null
  },
  {
    "_id": ObjectId("697b2ba77edfd4b8d8da54f5"),
    "tournament": ObjectId("697b2b9b7edfd4b8d8da549b"),
    "teamA": ObjectId("6974a92c4fe693fd19390b3a"),      // Dunk Masters
    "teamB": ObjectId("6974a92c4fe693fd19390b3c"),      // Real Madrid 5v5
    "scoreA": 0,
    "scoreB": 0,
    "date": new Date("2026-01-31T12:00:00.000Z"),
    "played": false,
    "round": 2,
    "field": null
  },
  {
    "_id": ObjectId("697b2ba77edfd4b8d8da54f6"),
    "tournament": ObjectId("697b2b9b7edfd4b8d8da549b"),
    "teamA": ObjectId("6974a92c4fe693fd19390b3d"),      // Barca Legends
    "teamB": ObjectId("6974a92c4fe693fd19390b3b"),      // Rim Protectors
    "scoreA": 0,
    "scoreB": 0,
    "date": new Date("2026-01-31T20:00:00.000Z"),
    "played": false,
    "round": 2,
    "field": null
  },
  {
    "_id": ObjectId("697b2ba77edfd4b8d8da54f7"),
    "tournament": ObjectId("697b2b9b7edfd4b8d8da549b"),
    "teamA": ObjectId("6974a92c4fe693fd19390b3a"),      // Dunk Masters
    "teamB": ObjectId("6974a92c4fe693fd19390b3b"),      // Rim Protectors
    "scoreA": 0,
    "scoreB": 0,
    "date": new Date("2026-02-01T20:00:00.000Z"),
    "played": false,
    "round": 3,
    "field": null
  },
  {
    "_id": ObjectId("697b2ba77edfd4b8d8da54f8"),
    "tournament": ObjectId("697b2b9b7edfd4b8d8da549b"),
    "teamA": ObjectId("6974a92c4fe693fd19390b3c"),      // Real Madrid 5v5
    "teamB": ObjectId("6974a92c4fe693fd19390b3d"),      // Barca Legends
    "scoreA": 0,
    "scoreB": 0,
    "date": new Date("2026-02-01T15:00:00.000Z"),
    "played": false,
    "round": 3,
    "field": null
  }
]);

print("***** Matches seeded successfully! *****");

print("***** Database seeded successfully! *****");