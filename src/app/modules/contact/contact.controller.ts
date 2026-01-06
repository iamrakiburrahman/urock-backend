import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ContactServices } from "./contact.service";

const createContact = catchAsync(async (req, res) => {
    const { id } = req.user as any;
    const result = await ContactServices.createContactToDB(id, req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Contact message sent successfully",
        data: result,
    });
});


const getAllContacts = catchAsync(async (req, res) => {
    const result = await ContactServices.getAllContactsFromDB(req.query);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Contact messages retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});


const getContactById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await ContactServices.getContactByIdFromDB(id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Contact message retrieved successfully",
        data: result,
    });
});


const deleteContactById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await ContactServices.deleteContactByIdFromDB(id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Contact message deleted successfully",
        data: result,
    });
});

export const ContactControllers = {
    createContact,
    getAllContacts,
    getContactById,
    deleteContactById,
};