import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../../models/event.dart';
import '../../services/registration_service.dart';

class EventDetailScreen extends StatelessWidget {
  final Event event;
  final RegistrationService _registrationService = RegistrationService();

  EventDetailScreen({required this.event});

  @override
  Widget build(BuildContext context) {
    final eventDoc = FirebaseFirestore.instance.collection('events').doc(event.id);

    return Scaffold(
      appBar: AppBar(title: Text(event.title)),
      body: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(event.description, style: TextStyle(fontSize: 18)),
            SizedBox(height: 20),

            StreamBuilder<DocumentSnapshot>(
              stream: eventDoc.snapshots(),
              builder: (context, snapshot) {
                if (!snapshot.hasData) return Text("Loading...");
                final data = snapshot.data!.data() as Map<String, dynamic>;
                final count = data['attendeeCount'] ?? 0;
                final max = data['maxAttendees'] ?? 0;
                return Text(
                  "Attendees: $count / $max",
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                );
              },
            ),

            SizedBox(height: 30),
            ElevatedButton(
              onPressed: () async {
                try {
                  final user = FirebaseAuth.instance.currentUser;
                  if (user == null) throw Exception("User not logged in");

                  await _registrationService.registerForEvent(user.uid, event.id);

                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text("Registered successfully!")),
                  );
                } catch (e) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text("Registration failed: $e")),
                  );
                }
              },
              child: Text("Register"),
            ),
          ],
        ),
      ),
    );
  }
}
