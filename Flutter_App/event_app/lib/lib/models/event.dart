import 'package:cloud_firestore/cloud_firestore.dart';

class Event {
  final String id;
  final String title;
  final String description;
  final int maxAttendees;
  final int attendeeCount;
  final String organizerId;

  Event({
    required this.id,
    required this.title,
    required this.description,
    required this.maxAttendees,
    required this.attendeeCount,
    required this.organizerId,
  });

  factory Event.fromMap(String id, Map<String, dynamic> data) {
    return Event(
      id: id,
      title: data['title'] ?? '',
      description: data['description'] ?? '',
      maxAttendees: (data['maxAttendees'] ?? 0) is int
          ? data['maxAttendees']
          : int.tryParse('${data['maxAttendees']}') ?? 0,
      attendeeCount: (data['attendeeCount'] ?? 0) is int
          ? data['attendeeCount']
          : int.tryParse('${data['attendeeCount']}') ?? 0,
      organizerId: data['organizerId'] ?? data['createdBy'] ?? '',
    );
  }

  factory Event.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return Event.fromMap(doc.id, data);
  }
}
