import 'package:flutter/material.dart';
import '../models/registration.dart';
import '../services/registration_service.dart';

class RegistrationList extends StatelessWidget {
  final List<Registration> registrations;
  final RegistrationService regService;

  RegistrationList({required this.registrations, required this.regService});

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: registrations.length,
      itemBuilder: (context, index) {
        final reg = registrations[index];
        return ListTile(
          title: Text("User: ${reg.userId} | Event: ${reg.eventId}"),
          trailing: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              IconButton(
                  icon: Icon(Icons.check, color: Colors.green),
                  onPressed: () => regService.approveRegistration(reg.id, reg.eventId)),
              IconButton(
                  icon: Icon(Icons.close, color: Colors.red),
                  onPressed: () => regService.rejectRegistration(reg.id)),
            ],
          ),
        );
      },
    );
  }
}
