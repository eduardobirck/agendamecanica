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
    lowercas: true,
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
    enum: ['user', 'admin','owner','funcionario'],
    default: 'user', 
  },

  status: {
    type: String,
    enum: ['ativo', 'inativo'],
    default: 'ativo',
  },

  oficina: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Oficina',
    required: false,
  }
}, { timestamps: true });


UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);