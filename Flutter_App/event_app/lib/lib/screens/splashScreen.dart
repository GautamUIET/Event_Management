import 'package:event_app/screens/student/student_home.dart';
import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

import 'admin/admin_dashboard.dart';
import 'authentication/login_screen.dart';
import 'organizer/organizer_dashboard.dart';


class SplashScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return StreamBuilder<User?>(
      stream: FirebaseAuth.instance.authStateChanges(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return Scaffold(body: Center(child: CircularProgressIndicator()));
        }

        final user = snapshot.data;
        if (user == null) {
          return LoginScreen();
        }

        return FutureBuilder<DocumentSnapshot>(
          future: FirebaseFirestore.instance.collection('users').doc(user.uid).get(),
          builder: (context, roleSnap) {
            if (!roleSnap.hasData) return Scaffold(body: Center(child: CircularProgressIndicator()));
            final data = roleSnap.data!.data() as Map<String, dynamic>?;

            final role = data?['role'] ?? 'student';
            if (role == 'admin') return AdminDashboard();
            if (role == 'organizer') return OrganizerDashboard();
            return StudentHome();
          },
        );
      },
    );
  }
}
