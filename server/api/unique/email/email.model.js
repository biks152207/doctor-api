'use strict';

import mongoose from 'mongoose';

var UniqueEmailSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

export default mongoose.model('UniqueEmail', UniqueEmailSchema);
