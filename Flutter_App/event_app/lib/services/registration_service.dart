import 'package:cloud_firestore/cloud_firestore.dart';

class RegistrationService {
  final CollectionReference _regRef = FirebaseFirestore.instance.collection('registrations');
  final CollectionReference _eventRef = FirebaseFirestore.instance.collection('events');

  /// Student registers for an event
  Future<void> registerForEvent(String userId, String eventId) async {
    await _regRef.add({
      'userId': userId,
      'eventId': eventId,
      'status': 'pending',            // initial state
      'timestamp': FieldValue.serverTimestamp(),
    });
  }

  /// Organizer approves a registration
  Future<void> approveRegistration(String regId, String eventId) async {
    final regDoc = _regRef.doc(regId);
    final eventDoc = _eventRef.doc(eventId);

    await FirebaseFirestore.instance.runTransaction((tx) async {
      // 1️⃣ Read both docs first
      final regSnapshot = await tx.get(regDoc);
      final eventSnapshot = await tx.get(eventDoc);

      // 2️⃣ Perform writes
      tx.update(regDoc, {'status': 'approved'});

      final currentCount = eventSnapshot['attendeeCount'] ?? 0;
      tx.update(eventDoc, {'attendeeCount': currentCount + 1});
    });
  }



  Future<void> rejectRegistration(String regId) async {
    await _regRef.doc(regId).update({'status': 'rejected'});
  }
}
