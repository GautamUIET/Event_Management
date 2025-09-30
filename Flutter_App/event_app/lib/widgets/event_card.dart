import 'package:flutter/material.dart';
import '../models/event.dart';

class EventCard extends StatelessWidget {
  final Event event;
  final VoidCallback? onTap;

  EventCard({required this.event, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: EdgeInsets.all(8),
      child: ListTile(
        title: Text(event.title, style: TextStyle(fontWeight: FontWeight.bold)),
        subtitle: Text(event.description),
        onTap: onTap,
      ),
    );
  }
}
