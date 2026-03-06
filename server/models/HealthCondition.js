import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
  },
  { _id: false }
);

const healthConditionSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    sections: [sectionSchema],
    relatedTests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Test" }],
  },
  { timestamps: true }
);

const HealthCondition = mongoose.model("HealthCondition", healthConditionSchema);
export default HealthCondition;
