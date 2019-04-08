let b = [1, 4, -1, 5, 2, -1, 3, 5]

for (var i = 0; i < b.length; i++) {
  let data = []
  if (b[i] > 0) {
    data << b[i]
  } else {
    data << b[i-1]
  }
  return data
}
