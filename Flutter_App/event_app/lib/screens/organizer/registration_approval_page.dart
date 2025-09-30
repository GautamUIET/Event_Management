// lib/screens/registration_approval_page.dart
import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../services/registration_service.dart';

class RegistrationApprovalPage extends StatelessWidget {
  final String eventId;
  final RegistrationService _regService = RegistrationService();

  RegistrationApprovalPage({required this.eventId});

  Future<void> _approve(String regId) async {
    await _regService.approveRegistration(regId, eventId);
  }

  Future<void> _reject(String regId) async {
    await _regService.rejectRegistration(regId);
  }

  @override
  Widget build(BuildContext context) {
    final regsRef = FirebaseFirestore.instance.collection('registrations').where('eventId', isEqualTo: eventId).where('status', isEqualTo: 'pending');

    return Scaffold(
      appBar: AppBar(title: Text('Manage Registrations')),
      body: StreamBuilder<QuerySnapshot>(
        stream: regsRef.snapshots(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) return Center(child: CircularProgressIndicator());
          if (!snapshot.hasData || snapshot.data!.docs.isEmpty) return Center(child: Text('No pending registrations'));

          final docs = snapshot.data!.docs;
          return ListView.builder(
            itemCount: docs.length,
            itemBuilder: (context, index) {
              final doc = docs[index];
              final reg = doc.data() as Map<String, dynamic>;
              final userId = reg['userId'] ?? 'Unknown';
              final timestamp = (reg['timestamp'] as Timestamp?)?.toDate();

              return Card(
                margin: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                child: ListTile(
                  title: Text('User: $userId'),
                  subtitle: Text('Requested: ${timestamp ?? '-'}'),
                  trailing: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      IconButton(
                        icon: Icon(Icons.check, color: Colors.green),
                        onPressed: () async {
                          await _approve(doc.id);
                          ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Approved')));
                        },
                      ),
                      IconButton(
                        icon: Icon(Icons.close, color: Colors.red),
                        onPressed: () async {
                          await _reject(doc.id);
                          ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Rejected')));
                        },
                      ),
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
