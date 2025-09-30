import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';

class AuthService {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _db = FirebaseFirestore.instance;


  Future<User?> signUp(String email, String password) async {
    UserCredential result =
    await _auth.createUserWithEmailAndPassword(email: email, password: password);
    User? user = result.user;

    if (user != null) {
      await _db.collection("users").doc(user.uid).set({
        "uid": user.uid,
        "email": user.email,
        "role": "student", // default role
      });
    }
    return user;
  }


  Future<User?> signIn(String email, String password) async {
    UserCredential result =
    await _auth.signInWithEmailAndPassword(email: email, password: password);
    return result.user;
  }

  Future<String?> getUserRole(String uid) async {
    DocumentSnapshot doc = await _db.collection("users").doc(uid).get();
    if (doc.exists) {
      return doc["role"];
    }
    return null;
  }
}
