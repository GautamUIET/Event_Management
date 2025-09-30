import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';

import '../../models/event.dart';
import '../../services/event_service.dart';

class AdminDashboard extends StatefulWidget {
  @override
  _AdminDashboardState createState() => _AdminDashboardState();
}

class _AdminDashboardState extends State<AdminDashboard> {
  final usersRef = FirebaseFirestore.instance.collection('users');
  final eventService = EventService();

  Future<void> _logout() async {
    await FirebaseAuth.instance.signOut();
    Navigator.of(context).pushNamedAndRemoveUntil('/login', (route) => false);
  }

  void _updateRole(String uid, String newRole) {
    usersRef.doc(uid).update({"role": newRole});
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          title: Text("Admin Dashboard"),
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
                      TextButton(
                          onPressed: () => Navigator.pop(context, false),
                          child: Text('Cancel')),
                      TextButton(
                          onPressed: () => Navigator.pop(context, true),
                          child: Text('Logout')),
                    ],
                  ),
                );
                if (confirm == true) {
                  await _logout();
                }
              },
            )
          ],
          bottom: TabBar(
            tabs: [
              Tab(text: 'Users'),
              Tab(text: 'Events'),
            ],
          ),
        ),
        body: TabBarView(
          children: [

            StreamBuilder<QuerySnapshot>(
              stream: usersRef.snapshots(),
              builder: (context, snapshot) {
                if (!snapshot.hasData)
                  return Center(child: CircularProgressIndicator());
                final users = snapshot.data!.docs;
                return ListView.builder(
                  itemCount: users.length,
                  itemBuilder: (context, index) {
                    final user = users[index];
                    return Card(
                      margin:
                      EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      child: ListTile(
                        title: Text(user["email"] ?? 'Unknown'),
                        subtitle: Text("Role: ${user["role"] ?? 'student'}"),
                        trailing: DropdownButton<String>(
                          value: user["role"] ?? 'student',
                          onChanged: (val) {
                            if (val != null) _updateRole(user.id, val);
                          },
                          items: ["student", "organizer", "admin"]
                              .map((role) => DropdownMenuItem(
                            value: role,
                            child: Text(role),
                          ))
                              .toList(),
                        ),
                      ),
                    );
                  },
                );
              },
            ),

            StreamBuilder<List<Event>>(
              stream: eventService.getEvents(),
              builder: (context, snapshot) {
                if (!snapshot.hasData) return Center(child: CircularProgressIndicator());
                final events = snapshot.data!;
                if (events.isEmpty) return Center(child: Text("No events yet."));

                return ListView.builder(
                  itemCount: events.length,
                  itemBuilder: (context, index) {
                    final e = events[index];
                    return Card(
                      margin: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      child: ListTile(
                        title: Text(e.title),
                        subtitle: Text('Max: ${e.maxAttendees} | Attendees: ${e.attendeeCount}'),
                      ),
                    );
                  },
                );
              },
            )

          ],
        ),
      ),
    );
  }
}

