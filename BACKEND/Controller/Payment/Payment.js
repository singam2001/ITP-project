const paymentModel = require("../../models/Payment/Payment");

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await paymentModel.find();
    res.json(payments);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.createPayment = async (req, res) => {
  const { payment_id, cash, bank, date } = req.body;
  const image = req.file ? req.file.filename : "";

  try {
    const newPayment = new paymentModel({
      payment_id,
      cash,
      bank,
      date,
      image,
    });
    await newPayment.save();
    res.status(201).json(newPayment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updatePayment = async (req, res) => {
  const { cash, bank, date } = req.body;
  const image = req.file ? req.file.filename : "";
  const id = req.params.id;

  try {
    const update = await paymentModel.findByIdAndUpdate(
      id,
      { cash, bank, date, image },
      { new: true }
    );

    if (!update) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json(update);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deletePayment = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedPayment = await paymentModel.findByIdAndDelete(id);

    if (!deletedPayment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(204).end();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
