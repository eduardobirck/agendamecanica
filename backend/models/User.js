const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Por favor, forneça um nome'],
  },
  email: {
    type: String,
    required: [true, 'Por favor, forneça um email'],
    unique: true, 
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Por favor, forneça um email válido',
    ],
  },
  password: {
    type: String,
    required: [true, 'Por favor, forneça uma senha'],
    minlength: 6,
    select: false, 
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user', 
  },
}, { timestamps: true });


UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Método para comparar a senha enviada no login com a senha no banco
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);