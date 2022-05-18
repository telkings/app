import mongoose from "mongoose";

const Schema = mongoose.Schema;

const pushnotifSchema = new Schema({
    userId: { type: String },
    email: { type: String },
    subscription: { type: String }
});

// Convertir a modelo
const Notifpush = mongoose.model("pushnotification", pushnotifSchema);

export default Notifpush;