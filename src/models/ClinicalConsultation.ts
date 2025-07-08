import { DataTypes, Model } from "sequelize";
import sequelize from "../config/config";

class ClinicalConsultation extends Model {
  public id!: number;
  public individual!: string;
  public consultation_date!: Date;
  public consultation_time!: string;
  public location!: string;
  public submitted_by!: string;
  public observations!: string; // JSON string
  public description!: string;
  public status!: 'pending' | 'reviewed' | 'completed' | 'cancelled';
  public submitted_at!: Date;
  public reviewed_at!: Date | null;
  public reviewed_by!: string | null;
  public notes!: string | null;
  public created_at!: Date;
  public updated_at!: Date;
}

ClinicalConsultation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    individual: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    consultation_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    consultation_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    submitted_by: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    observations: {
      type: DataTypes.TEXT, // Store JSON as TEXT
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('observations');
        return rawValue ? JSON.parse(rawValue) : null;
      },
      set(value: any) {
        this.setDataValue('observations', value ? JSON.stringify(value) : null);
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'reviewed', 'completed', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending',
    },
    submitted_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    reviewed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    reviewed_by: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "clinical_consultations",
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default ClinicalConsultation; 