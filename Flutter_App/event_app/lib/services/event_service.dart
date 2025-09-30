// lib/services/event_service.dart
import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/event.dart';

class EventService {
  final CollectionReference _eventRef = FirebaseFirestore.instance.collection('events');

  // Stream all events (for students)
  Stream<List<Event>> getEvents() {
    return _eventRef.snapshots().map((snapshot) {
      return snapshot.docs
          .map((doc) => Event.fromMap(doc.id, doc.data() as Map<String, dynamic>))
          .toList();
    });
  }

  // Stream events created by a specific organizer
  Stream<List<Event>> getEventsByOrganizer(String organizerId) {
    return _eventRef.where('organizerId', isEqualTo: organizerId).snapshots().map((snapshot) {
      return snapshot.docs
          .map((doc) => Event.fromMap(doc.id, doc.data() as Map<String, dynamic>))
          .toList();
    });
  }

  // Create a new event
  Future<DocumentReference> createEvent({
    required String title,
    required String description,
    required int maxAttendees,
    required String organizerId,
  }) async {
    final docRef = await _eventRef.add({
      'title': title,
      'description': description,
      'maxAttendees': maxAttendees,
      'attendeeCount': 0,
      'organizerId': organizerId,
      'createdAt': FieldValue.serverTimestamp(),
    });
    return docRef;
  }

  // Optional: delete event
  Future<void> deleteEvent(String eventId) async {
    await _eventRef.doc(eventId).delete();
  }
}
