import MenuItemService from "../services/MenuItemService.js";

export const getMenu = async (req, res) => {
  try {
    const menuItems = await MenuItemService.getMenu();
    res.status(200).json(menuItems);
  } catch (err) {
    res.status(500).json({ message: 'Cannot get menu items' });
  }
};

export const addItem = async (req,res) => {
  try {
    const {item_name, price, quantity} = req.body
    await MenuItemService.addMenuItem(item_name,price,quantity)
    res.status(200).json({message: "ok"})

  } catch (error) {
    res.status(500).json({message: "not ok"})
  }
}

export const updateItem = async (req,res) => {
  try {
    const id = req.params.id
    const {item_name, price, quantity} = req.body

    await MenuItemService.updateMenuItem(id,item_name,price,quantity)
    res.status(200).json({message: "ok"})

  } catch (error) {
    res.status(500).json({message: "not ok"})
  }
}

export const removeItem = async (req,res) => {
  try {

    const id = req.params.id
    console.log(id)
    await MenuItemService.removeMenuItem(id)
    res.status(200).json({message: "ok"})

  } catch (error) {
    res.status(500).json({message: "not ok"})
  }
}
