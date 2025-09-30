import 'package:event_app/screens/admin/admin_dashboard.dart';
import 'package:event_app/screens/authentication/login_screen.dart';
import 'package:event_app/screens/organizer/organizer_dashboard.dart';
import 'package:event_app/screens/splashScreen.dart';
import 'package:event_app/screens/student/student_home.dart';
import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Campus Events',
      routes: {
        '/login': (_) => LoginScreen(),
        '/student': (_) => StudentHome(),
        '/organizer': (_) => OrganizerDashboard(),
        '/admin': (_) => AdminDashboard(),
      },
      theme: ThemeData(primarySwatch: Colors.blue),
      home: SplashScreen(),
    );
  }
}
