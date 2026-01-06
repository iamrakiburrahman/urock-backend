import { Types } from "mongoose";
import config from "../../../config";
import { emailHelper } from "../../../helpers/emailHelper";
import { Contact } from "./contact.model";
import AppError from "../../../errors/AppError";
import { User } from "../user/user.model";
import { TContact } from "./contact.interface";
import QueryBuilder from "../../builder/QueryBuilder";

const createContactToDB = async (id: string, payload: TContact) => {

    const user = await User.findById(id);
    if (!user) {
        throw new AppError(404, "User not found!");
    }

    payload.userId = new Types.ObjectId(id);

    const contactEntry = await Contact.create(payload);

    const emailPayload = {
        to: payload.email,
        subject: `New Contact Message: ${payload.name}`,
        html: `
    <div style="max-width:600px;margin:20px auto;font-family:'Segoe UI',Arial,sans-serif;border:1px solid #f0f0f0;border-radius:10px;overflow:hidden;background-color:#ffffff;">
      
      <div style="background-color:#ff6a2c;padding:25px;text-align:center;color:#ffffff">
        <h1 style="margin:0;font-size:24px;">Emma Contact Service</h1>
        <p style="margin:5px 0 0;opacity:0.9;">You have a new inquiry from a user</p>
      </div>

      <div style="padding:30px;color:#333;">
        <h3 style="color:#ff6a2c;border-bottom:2px solid #ff6a2c;display:inline-block;padding-bottom:5px;">User Details</h3>
        
        <p style="font-size:15px;line-height:1.5;"><strong>Name:</strong> ${payload.name}</p>
        <p style="font-size:15px;line-height:1.5;"><strong>Email:</strong> ${payload.email}</p>
        <p style="font-size:15px;line-height:1.5;"><strong>Phone:</strong> ${payload.phone}</p>
        
        <div style="margin-top:25px;padding:20px;background-color:#fff5f2;border-radius:8px;border:1px dashed #ff6a2c;">
          <p style="margin-top:0;font-weight:bold;color:#ff6a2c;">Message:</p>
          <p style="margin-bottom:0;font-size:15px;font-style:italic;color:#555;">"${payload.message}"</p>
        </div>

        <div style="text-align:center;margin-top:30px;">
          <a href="mailto:${payload.email}" style="background-color:#ff6a2c;color:#ffffff;padding:12px 25px;text-decoration:none;border-radius:5px;font-weight:bold;display:inline-block;">
            Reply to User
          </a>
        </div>
      </div>

      <div style="background-color:#f8f8f8;padding:15px;text-align:center;font-size:12px;color:#999;">
        © ${new Date().getFullYear()} Emma Project. All rights reserved.
      </div>
    </div>
    `,
    };

    // send mail
    await emailHelper.sendEmail(emailPayload);

    return contactEntry;
};

const getAllContactsFromDB = async (query: Record<string, unknown>) => {
    const baseQuery = Contact.find().populate({
        path: "userId",
        select: "_id name email phone role image",
    });

    const queryBuilder = new QueryBuilder(baseQuery, query)
        .search(["name", "email", "phone", "message"])
        .sort()
        .fields()
        .filter()
        .paginate();

    const contacts = await queryBuilder.modelQuery;
    const meta = await queryBuilder.countTotal();

    if (!contacts || contacts.length === 0) {
        throw new AppError(404, "Contact messages not found in the database");
    }

    return {
        data: contacts,
        meta,
    };
};

const getContactByIdFromDB = async (id: string) => {
    const contact = await Contact.findById(id).populate({
        path: "userId",
        select: "name email phone message",
    });

    if (!contact) {
        throw new AppError(404, "No contact message found with this ID");
    }

    return contact;
};

const deleteContactByIdFromDB = async (id: string) => {
    const contact = await Contact.findByIdAndDelete(id);

    if (!contact) {
        throw new AppError(400, "Failed to delete this contact message");
    }

    return contact;
};

export const ContactServices = {
    createContactToDB,
    getAllContactsFromDB,
    getContactByIdFromDB,
    deleteContactByIdFromDB,
};