import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../../models/event.dart';
import '../../services/event_service.dart';
import 'registration_approval_page.dart';

class OrganizerDashboard extends StatefulWidget {
  final String? organizerId;

  OrganizerDashboard({this.organizerId});

  @override
  _OrganizerDashboardState createState() => _OrganizerDashboardState();
}

class _OrganizerDashboardState extends State<OrganizerDashboard> {
  final _titleController = TextEditingController();
  final _descController = TextEditingController();
  final _maxController = TextEditingController();
  final EventService _eventService = EventService();
  bool _isCreating = false;

  String get _currentOrganizerId {
    if (widget.organizerId != null) return widget.organizerId!;
    final user = FirebaseAuth.instance.currentUser;
    return user?.uid ?? '';
  }

  Future<void> _createEvent() async {
    final title = _titleController.text.trim();
    final desc = _descController.text.trim();
    final maxText = _maxController.text.trim();
    final maxAttendees = int.tryParse(maxText) ?? 0;

    if (title.isEmpty || desc.isEmpty || maxAttendees <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Please fill all fields with valid values.')));
      return;
    }

    setState(() => _isCreating = true);
    try {
      await _eventService.createEvent(
        title: title,
        description: desc,
        maxAttendees: maxAttendees,
        organizerId: _currentOrganizerId,
      );

      _titleController.clear();
      _descController.clear();
      _maxController.clear();

      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Event created successfully.')));
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Failed to create event: $e')));
    } finally {
      setState(() => _isCreating = false);
    }
  }

  @override
  void dispose() {
    _titleController.dispose();
    _descController.dispose();
    _maxController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final organizerId = _currentOrganizerId;

    return Scaffold(
      appBar: AppBar(
        title: Text('Organizer Dashboard'),
        actions: [
          IconButton(
            icon: Icon(Icons.logout),
            tooltip: 'Logout',
            onPressed: () async {
              final confirm = await showDialog<bool>(
                context: context,
                builder: (_) => AlertDialog(
                  title: Text('Logout?'),
                  content: Text('Do you want to logout from this account?'),
                  actions: [
                    TextButton(onPressed: () => Navigator.pop(context, false), child: Text('Cancel')),
                    TextButton(onPressed: () => Navigator.pop(context, true), child: Text('Logout')),
                  ],
                ),
              );
              if (confirm == true) {
                await FirebaseAuth.instance.signOut();
                Navigator.of(context).pushNamedAndRemoveUntil('/login', (route) => false);
              }
            },
          )
        ],
      ),

        body: Column(
        children: [
          // Add event form
          Padding(
            padding: const EdgeInsets.all(12.0),
            child: Column(
              children: [
                Text('Create New Event', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                SizedBox(height: 8),
                TextField(
                  controller: _titleController,
                  decoration: InputDecoration(labelText: 'Event Title', border: OutlineInputBorder()),
                ),
                SizedBox(height: 8),
                TextField(
                  controller: _descController,
                  maxLines: 2,
                  decoration: InputDecoration(labelText: 'Description', border: OutlineInputBorder()),
                ),
                SizedBox(height: 8),
                TextField(
                  controller: _maxController,
                  keyboardType: TextInputType.number,
                  decoration: InputDecoration(labelText: 'Max Attendees', border: OutlineInputBorder()),
                ),
                SizedBox(height: 10),
                _isCreating
                    ? CircularProgressIndicator()
                    : ElevatedButton.icon(
                  icon: Icon(Icons.add),
                  label: Text('Add Event'),
                  onPressed: _createEvent,
                ),
              ],
            ),
          ),

          Divider(),

          // List of organizer's events
          Expanded(
            child: StreamBuilder<List<Event>>(
              stream: _eventService.getEventsByOrganizer(organizerId),
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) return Center(child: CircularProgressIndicator());
                if (!snapshot.hasData || snapshot.data!.isEmpty) {
                  return Center(child: Text('No events yet. Create one above.'));
                }

                final events = snapshot.data!;
                return ListView.builder(
                  itemCount: events.length,
                  itemBuilder: (context, idx) {
                    final e = events[idx];
                    return Card(
                      margin: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      child: ListTile(
                        title: Text(e.title),
                        subtitle: Text('${e.description}\nAttendees: ${e.attendeeCount} / ${e.maxAttendees}'),
                        isThreeLine: true,
                        trailing: PopupMenuButton<String>(
                          onSelected: (value) async {
                            if (value == 'manage') {
                              Navigator.push(
                                context,
                                MaterialPageRoute(builder: (_) => RegistrationApprovalPage(eventId: e.id)),
                              );
                            } else if (value == 'delete') {
                              // delete confirmation
                              final ok = await showDialog<bool>(
                                context: context,
                                builder: (_) => AlertDialog(
                                  title: Text('Delete event?'),
                                  content: Text('Are you sure you want to delete "${e.title}"? This cannot be undone.'),
                                  actions: [
                                    TextButton(onPressed: () => Navigator.pop(context, false), child: Text('Cancel')),
                                    TextButton(onPressed: () => Navigator.pop(context, true), child: Text('Delete')),
                                  ],
                                ),
                              );
                              if (ok == true) {
                                await _eventService.deleteEvent(e.id);
                                ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Event deleted')));
                              }
                            }
                          },
                          itemBuilder: (_) => [
                            PopupMenuItem(value: 'manage', child: Text('Manage Registrations')),
                            PopupMenuItem(value: 'delete', child: Text('Delete', style: TextStyle(color: Colors.red))),
                          ],
                        ),
                      ),
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
