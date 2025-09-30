import 'package:cloud_firestore/cloud_firestore.dart';

class RegistrationService {
  final CollectionReference _regRef = FirebaseFirestore.instance.collection('registrations');
  final CollectionReference _eventRef = FirebaseFirestore.instance.collection('events');

  Future<void> registerForEvent(String userId, String eventId) async {
    await _regRef.add({
      'userId': userId,
      'eventId': eventId,
      'status': 'pending',
      'timestamp': FieldValue.serverTimestamp(),
    });
  }

  Future<void> approveRegistration(String regId, String eventId) async {
    final regDoc = _regRef.doc(regId);
    final eventDoc = _eventRef.doc(eventId);

    await FirebaseFirestore.instance.runTransaction((tx) async {
      final regSnapshot = await tx.get(regDoc);
      final eventSnapshot = await tx.get(eventDoc);

      tx.update(regDoc, {'status': 'approved'});

      final currentCount = eventSnapshot['attendeeCount'] ?? 0;
      tx.update(eventDoc, {'attendeeCount': currentCount + 1});
    });
  }



  Future<void> rejectRegistration(String regId) async {
    await _regRef.doc(regId).update({'status': 'rejected'});
  }
}
