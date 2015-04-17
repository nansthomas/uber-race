# Carousel variables
carouselContent = $(".carousel__content")
carouselIndex = 0
carouselLength = carouselContent.children().length

isAnimating = false
itemWidth = 100 / carouselLength
firstItem = $(carouselContent.children()[0])
lastItem = $(carouselContent.children()[carouselLength - 1])
firstClone = null
lastClone = null

# Apply the 3D transformations to avoid a white blink when you slide for the first time
carouselContent.css "width", carouselLength * 100 + "%"
carouselContent.transition { x:"#{carouselIndex * -itemWidth}%" }, 0

$.each carouselContent.children(), -> $(@).css "width", itemWidth + "%"
  
# Click on the "Previous" button
$(".nav--left").on "click", ->
  return if isAnimating
  isAnimating = true
    
  carouselIndex--
  if carouselIndex == -1
    lastItem.prependTo carouselContent
    carouselContent.transition { x:"#{(carouselIndex + 2) * -itemWidth}%" }, 0
    carouselContent.transition { x:"#{(carouselIndex + 1) * -itemWidth}%" }, 1000, "easeInOutExpo", ->
      carouselIndex = carouselLength - 1
      lastItem.appendTo carouselContent
      carouselContent.transition { x:"#{(carouselIndex) * -itemWidth}%" }, 0
      isAnimating = false
  else
    carouselContent.transition { x:"#{carouselIndex * -itemWidth}%" }, 1000, "easeInOutExpo", -> isAnimating = false

# Click on the "Next" button
$(".nav--right").on "click", ->
  return if isAnimating
  isAnimating = true
    
  carouselIndex++
    
  carouselContent.transition { x:"#{carouselIndex * -itemWidth}%" }, 1000, "easeInOutExpo", ->
    isAnimating = false
    if firstClone
      carouselIndex = 0
      carouselContent.transition { x:"#{(carouselIndex) * -itemWidth}%" }, 0
      firstClone.remove()
      firstClone = null
      
      carouselLength = carouselContent.children().length
      itemWidth = 100 / carouselLength
      carouselContent.css "width", carouselLength * 100 + "%"
      $.each carouselContent.children(), -> $(@).css "width", itemWidth + "%"
      return
        
    if carouselIndex == carouselLength - 1
      carouselLength++
      itemWidth = 100 / carouselLength
      
      firstClone = firstItem.clone()
      firstClone.addClass "clone"
      firstClone.appendTo carouselContent
       
      carouselContent.css "width", carouselLength * 100 + "%"
      $.each carouselContent.children(), -> $(@).css "width", itemWidth + "%"
      carouselContent.transition { x:"#{(carouselIndex) * -itemWidth}%" }, 0