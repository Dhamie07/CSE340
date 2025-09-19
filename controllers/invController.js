const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 * Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 * Build inventory by invId view
 * ************************** */ 
async function buildByInvId(req, res, next) {
  const invId = req.params.invId
  const invData = await invModel.getInventoryByInvId(invId)
  console.log(invData)
  if (!invData) {
    req.flash("notice", "Sorry, no vehicle information could be found.")
    res.render("inventory/detail", {
      title: "Vehicle Not Found",
      nav: await utilities.getNav(),
      invDetail: "<h1>Vehicle Not Found</h1>"
    })
  } else {
    const invDetailHtml = await utilities.buildInvDetailHtml(invData)
    const itemName = `${invData.inv_make} ${invData.inv_model}`
    res.render("inventory/detail", {
      title: itemName,
      nav: await utilities.getNav(),
      invDetail: invDetailHtml,
    })
  }
}

// All controller functions must be exported as an object to be seen by the routes.
invCont.buildByInvId = utilities.handleErrors(buildByInvId)

module.exports = invCont
