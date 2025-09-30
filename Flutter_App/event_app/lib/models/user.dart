class UserModel {
  final String id;
  final String name;
  final String email;
  final String role;

  UserModel({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
  });

  factory UserModel.fromFirestore(doc) {
    return UserModel(
      id: doc.id,
      name: doc['name'],
      email: doc['email'],
      role: doc['role'],
    );
  }
}
