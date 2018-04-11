import pytest

import lv95_web_swiss

def test_scale_factor():
    assert lv95_web_swiss.scaleFactor == pytest.approx(83.48962)


@pytest.mark.parametrize("coordinates", [
    ([26000000, 12000000], [1948647686, 895843602]),
    ([2538000, 1152000], [-10185733, -9851775])
])
def test_to_web_swiss(coordinates):
    coordinates_lv95 = coordinates[0]
    expected_web_swiss = coordinates[1]
    assert lv95_web_swiss.to_web_swiss(coordinates_lv95) == pytest.approx(expected_web_swiss)
