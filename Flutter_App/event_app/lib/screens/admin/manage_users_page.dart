import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class ManageUsersPage extends StatelessWidget {
  void _updateRole(String uid, String newRole) {
    FirebaseFirestore.instance.collection("users").doc(uid).update({"role": newRole});
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Manage Users")),
      body: StreamBuilder<QuerySnapshot>(
        stream: FirebaseFirestore.instance.collection("users").snapshots(),
        builder: (context, snapshot) {
          if (!snapshot.hasData) return Center(child: CircularProgressIndicator());
          final users = snapshot.data!.docs;
          return ListView.builder(
            itemCount: users.length,
            itemBuilder: (context, index) {
              final user = users[index];
              return Card(
                child: ListTile(
                  title: Text(user["email"]),
                  subtitle: Text("Role: ${user["role"]}"),
                  trailing: DropdownButton<String>(
                    value: user["role"],
                    onChanged: (val) {
                      if (val != null) _updateRole(user.id, val);
                    },
                    items: ["student", "organizer", "admin"].map((role) {
                      return DropdownMenuItem(value: role, child: Text(role));
                    }).toList(),
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
