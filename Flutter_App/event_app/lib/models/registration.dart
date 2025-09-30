class Registration {
  final String id;
  final String userId;
  final String eventId;
  final String status;

  Registration({
    required this.id,
    required this.userId,
    required this.eventId,
    required this.status,
  });

  factory Registration.fromFirestore(doc) {
    return Registration(
      id: doc.id,
      userId: doc['userId'],
      eventId: doc['eventId'],
      status: doc['status'],
    );
  }
}
