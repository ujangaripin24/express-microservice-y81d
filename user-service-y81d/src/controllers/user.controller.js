import * as userService from '../services/user.service.js'

export const GetAllUsers = async (req, res) => {
    try {
        const { page, size, search } = req.query;
        const result = await userService.GetAllUsers({ page, size, search });
        if (!result.data || result.data.length === 0) {
            res.status(500).json({ errors: [{ msg: "tidak ada data" }] });
        }

        res.status(200).json({
            status: 200,
            data: result.data,
            size: result.size,
            page: result.page,
            totalPage: result.totalPage,
            totalData: result.totalData
        })
    } catch (error) {
        res.status(500).json({ errors: [{ msg: error.message }] });
    }
}

export const GetUserByUUID = async (req, res) => {
    try {
        const { uuid } = req.params;
        const result = await userService.GetUserByUUID(uuid);
        res.status(200).json({
            status: 200,
            data: result
        })
    } catch (error) {
        res.status(500).json({ errors: [{ msg: error.message }] });
    }
}

export const CreateUser = async (req, res) => {
    try {
        await userService.CreateUser(req.body);
        res.status(200).json({
            msg: "user created"
        })
    } catch (error) {
        res.status(500).json({ errors: [{ msg: error.message }] });
    }
}

export const UpdateUser = async (req, res) => {
    try {
        const { uuid } = req.params.uuid;
        const body = req.body;
        await userService.GetUserByID(uuid, body);
        res.status(200).json({
            status: 200,
            data: "updated success"
        });
    } catch (error) {
        res.status(500).json({ errors: [{ msg: error.message }] });
    }
}

export const DeleteUser = async (req, res) => {
    try {
        const { uuid } = req.params;
        await userService.DeleteUser(uuid);
        res.status(200).json({
            status: 200,
            data: "deleted success"
        });
    } catch (error) {
        res.status(500).json({ errors: [{ msg: error.message }] });
    }
}

export const GetUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await userService.GetUserByEmail(email);
    if (!user) {
      return res.status(404).json({ msg: "User tidak ditemukan" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};